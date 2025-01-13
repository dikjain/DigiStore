import { cartTable, productsTable } from "@/Configs/schema";
import { db } from "@/Configs/ds";
import { NextResponse } from "next/server";
import { eq, getTableColumns } from "drizzle-orm";

export async function POST(req) {
    try {
        const { product, email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await db.insert(cartTable).values({ product, email }).catch(error => {
            console.error("Error inserting into cartTable:", error);
            throw new Error("Database Insertion Error");
        });

        const cartColumns = getTableColumns(productsTable);
        const completeProduct = await db.select([cartColumns, cartTable.id])
            .from(cartTable)
            .innerJoin(productsTable, eq(cartTable.product, productsTable.id))
            .where(eq(cartTable.email, email))
            .then(result => result[result.length-1])
            .catch(error => {
                console.error("Error selecting from database:", error);
                throw new Error("Database Selection Error");
            });

        return NextResponse.json(completeProduct);
    } catch (error) {
        console.error("Error processing POST request:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const cartColumns = getTableColumns(productsTable);
    const cart = await db.select([cartColumns, cartTable.id])
        .from(cartTable)
        .innerJoin(productsTable, eq(cartTable.product, productsTable.id))
        .where(eq(cartTable.email, email))
        .catch(error => {
            console.error("Database query failed:", error);
            return NextResponse.json({ error: "Failed to retrieve cart" }, { status: 500 });
        });
    return NextResponse.json(cart);
}


export async function DELETE(req) {
    const { id, email } = await req.json();    
    await db.delete(cartTable).where(eq(cartTable.id, id));
    const cartColumns = getTableColumns(productsTable);
    const cart = await db.select([cartColumns, cartTable.id])
        .from(cartTable)
        .innerJoin(productsTable, eq(cartTable.product, productsTable.id))
        .where(eq(cartTable.email, email))
        .catch(error => {
            console.error("Error selecting from database:", error);
            throw new Error("Database Selection Error");
        });
    return NextResponse.json(cart);
}


