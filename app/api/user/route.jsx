import { db } from "@/Configs/ds";
import { usersTable } from "@/Configs/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; // Import eq from drizzle-orm

export async function POST(req){

    const {user} = await req.json()

    const userData = await db.select().from(usersTable).where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress))

    if(userData.length <= 0){
        const newUser = await db.insert(usersTable).values({
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName,
            image: user?.imageUrl,
        }).returning(usersTable)

        return NextResponse.json(newUser)
    }

    return NextResponse.json(userData[0])
}
