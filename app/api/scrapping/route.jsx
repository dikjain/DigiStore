import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || 'JavaScript tutorials'; // Default search query
    
    // Scrape YouTube
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const ytResponse = await axios.get(ytUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0'
      }
    });

    const ytData = ytResponse.data;
    const ytInitialData = JSON.parse(ytData.split('var ytInitialData = ')[1].split(';</script>')[0]);
    
    let contents = [];
    if (ytInitialData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents) {
      contents = ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;
    }

    const videos = [];
    const shorts = [];
    const regularVideos = [];
    
    contents.forEach(section => {
      if (section.itemSectionRenderer) {
        section.itemSectionRenderer.contents.forEach(content => {
          if (content.videoRenderer || content.reelItemRenderer) {
            const isShort = !!content.reelItemRenderer;
            const video = isShort ? content.reelItemRenderer : content.videoRenderer;
            const title = isShort ? (video.headline?.simpleText || '') : (video.title?.runs?.[0]?.text || '');
            const videoId = video.videoId;
            const link = isShort ? 
              `https://www.youtube.com/shorts/${videoId}` :
              `https://www.youtube.com/watch?v=${videoId}`;
            const duration = video.lengthText?.simpleText || '';
            const views = isShort ? (video.viewCountText?.simpleText || '') : (video.viewCountText?.simpleText || '');
            const thumbnail = video.thumbnail.thumbnails[video.thumbnail.thumbnails.length - 1].url;
            const channelName = isShort ? (video.channelThumbnail?.channelThumbnailWithLinkRenderer?.navigationEndpoint?.browseEndpoint?.browseId || '') : (video.ownerText?.runs?.[0]?.text || '');
            const channelLink = isShort ? (video.channelThumbnail?.channelThumbnailWithLinkRenderer?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl || '') : (video.ownerText?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url || '');
            const publishedTime = video.publishedTimeText?.simpleText || '';
            const description = video.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map(r => r.text).join('') || '';
            const badges = video.badges?.map(badge => badge.metadataBadgeRenderer?.label) || [];
            const thumbnailOverlays = video.thumbnailOverlays
              ?.filter(overlay => overlay.thumbnailOverlayTimeStatusRenderer)
              ?.map(overlay => overlay.thumbnailOverlayTimeStatusRenderer.text?.simpleText)
              || [];

            const thumbnails = video.thumbnail.thumbnails.map(thumb => ({
              url: thumb.url,
              width: thumb.width,
              height: thumb.height
            }));

            const videoData = {
              title,
              link,
              duration,
              views,
              thumbnail,
              thumbnails,
              channelName,
              channelLink: channelLink ? `https://www.youtube.com${channelLink}` : '',
              publishedTime,
              description,
              badges,
              thumbnailOverlays,
              videoId,
              isShort: duration ? duration.split(':').reduce((acc, time) => (60 * acc) + parseInt(time)) < 90 : false
            };

            videos.push(videoData);
            
            if (isShort || videoData.isShort) {
              shorts.push(videoData);
            } else {
              regularVideos.push(videoData);
            }
          }
        });
      }
    });

    // Scrape Reddit
    const redditUrl = `https://www.reddit.com/search/.json?q=${encodeURIComponent(query)}`;
    const redditResponse = await axios.get(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const redditPosts = [];
    const redditDiscussions = [];
    const redditMedia = [];

    const posts = redditResponse.data.data.children;
    posts.slice(0, 10).forEach(post => {
      const data = post.data;
      const title = data.title;
      const link = `https://www.reddit.com${data.permalink}`;
      const isMedia = data.is_video || data.is_gallery || data.post_hint === 'image';
      const postData = { 
        title, 
        link,
        isMedia,
        score: data.score,
        numComments: data.num_comments,
        subreddit: data.subreddit_name_prefixed,
        author: data.author
      };

      redditPosts.push(postData);
      
      if (isMedia) {
        redditMedia.push(postData);
      } else {
        redditDiscussions.push(postData);
      }
    });

    if (videos.length === 0 && redditPosts.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No content found in the response data.'
      });
    }

    return NextResponse.json({ 
      success: true, 
      youtube: {
        all: videos,
        shorts: shorts,
        regularVideos: regularVideos,
        totalCount: videos.length,
        shortsCount: shorts.length,
        regularCount: regularVideos.length
      },
      reddit: {
        all: redditPosts,
        discussions: redditDiscussions,
        media: redditMedia,
        totalCount: redditPosts.length,
        discussionsCount: redditDiscussions.length,
        mediaCount: redditMedia.length
      },
      query: query,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error scraping content:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}