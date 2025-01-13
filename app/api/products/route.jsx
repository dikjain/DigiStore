import { NextResponse } from "next/server";
import takeImage from "../../../Configs/FireBase";
import { db } from "@/Configs/ds";
import { cartTable, productsTable, usersTable } from "../../../Configs/schema";
import { desc, eq, inArray } from "drizzle-orm";

export async function POST(req) {
    const formData = await req.formData();
    const image = formData.get("image");
    const data = formData.get("data");
    const file = formData.get("file");
    const imageUrl = await takeImage(image);
    const fileUrl = await takeImage(file);

    const updatedData = {
        ...JSON.parse(data),
        image: imageUrl,
        file: fileUrl,
    };

    await db.insert(productsTable).values(updatedData).returning();

    return NextResponse.json(updatedData);
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const id = searchParams.get("id");
    const category = searchParams.get("category");

    if (search) {
        const products = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.createdBy, search))
            .orderBy(desc(productsTable.id));
        return NextResponse.json(products);
    }
    if(id){
        const product = await db
        .select()
        .from(productsTable)
        .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
        .where(eq(productsTable.id, id));
        return NextResponse.json(product);
    }   

    if(category){
        const products = await db
        .select()
        .from(productsTable)
        .limit(4)
        .orderBy(desc(productsTable.id))
        .where(eq(productsTable.category, category));
        return NextResponse.json(products);
    }

    if (limit) {
        const products = await db
            .select()
            .from(productsTable)
            .orderBy(desc(productsTable.id))
            .limit(limit);

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

    const products = await db.select().from(productsTable);
    return NextResponse.json(products);
}
export async function DELETE(req) {
    const { id } = await req.json();
    try {
        await db.delete(cartTable).where(eq(cartTable.product, id));
        await db.delete(productsTable).where(eq(productsTable.id, id));
        return NextResponse.json({ message: "Product and its references deleted" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}