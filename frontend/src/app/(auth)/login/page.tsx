"use client";
import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";
import bg from "../../public/img/background-gradient.jpg";

export default function Home() {
	return (
		<main className="h-[100vh] flex items-center justify-center bg-banner bg-cover">
			<LoginForm />
		</main>
	);
}
