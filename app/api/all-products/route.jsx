import { productsTable, usersTable } from "@/Configs/schema";
import { NextResponse } from "next/server";
import { db } from "@/Configs/ds";
import { asc, desc, inArray, like } from "drizzle-orm";

export async function POST(req) {
    const { limit, offset,search,sort } = await req.json();

    if (limit && !search) {
        const products = await db
            .select()
            .from(productsTable)
            .orderBy(sort ? (sort.order === "desc" ? desc(productsTable[sort.field]) : asc(productsTable[sort.field])) : desc(productsTable.id))
            .limit(limit)
            .offset(offset);


        const userEmails = products.map(product => product.createdBy);
        const userDetails = await db
            .select()
            .from(usersTable)
            .where(inArray(usersTable.email, userEmails));

        const productsWithUserDetails = products.map(product => ({
            ...product,
            user: userDetails.find(user => user.email === product.createdBy),
        }));

        return NextResponse.json(productsWithUserDetails);
    }

    if(search){
        const products = await db
            .select()
            .from(productsTable)
            .where(like(productsTable.title, `%${search}%`))
            .orderBy(sort ? (sort.order === "desc" ? desc(productsTable[sort.field]) : asc(productsTable[sort.field])) : desc(productsTable.id))

            return NextResponse.json(products);
    }

    return NextResponse.json(products);
}

