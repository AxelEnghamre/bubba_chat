import supabase from "@/lib/supabaseStore";
import { NextResponse } from "next/server";

export default async function fetchUser(req, res) {
    const { userId } = req.body;
    
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
    
    if (error) {
        return NextResponse.error();
    }
    
    return NextResponse.next();
    }

    