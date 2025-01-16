import { productsTable, usersTable } from "@/Configs/schema";
import { NextResponse } from "next/server";
import { db } from "@/Configs/ds";
import { eq } from "drizzle-orm";
import takeImage from "@/Configs/FireBase";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
        const product = await db
            .select()
            .from(productsTable)
            .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
            .where(eq(productsTable.id, id));
        return NextResponse.json(product);
    }

    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const formData = await req.formData();
    const image = formData.get("image");
    const data = formData.get("data");
    const file = formData.get("file");
    const parsedData = JSON.parse(data);

    if (!id) {
        return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    let imageUrl = parsedData.image;
    let fileUrl = parsedData.file;

    if (parsedData.changeInImages) {
        if (image) {
            if (typeof image !== 'string') {
                imageUrl = await takeImage(image);
            }
        }
        if (file) {
            if (typeof file !== 'string') {
                fileUrl = await takeImage(file);
            }
        }
    }

    const { id: _, ...dataWithoutId } = parsedData;
    const updatedData = {
        ...dataWithoutId,
        image: imageUrl,
        file: fileUrl,
    };

    await db.update(productsTable).set(updatedData).where(eq(productsTable.id, id));

    return NextResponse.json(updatedData);
}
