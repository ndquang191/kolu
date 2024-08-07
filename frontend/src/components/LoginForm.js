"use client";
import React, { useRef } from "react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "./ui/card";
import { LockIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { login } from "@/utils/login";

import { useState } from "react";
const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// const [type, setType] = useState("student");
	const typeRef = useRef(null);

	const handleLogin = async (e) => {
		e.preventDefault();

		// console.log({
		// 	email: email,
		// 	password: password,
		// 	type: typeRef.current.innerHTML.toLowerCase(),
		// });

		login(email, password, typeRef.current.innerHTML.toLowerCase());
	};
	return (
		<div className="flex flex-col items-center">
			<Card className="mx-auto max-w-sm shadow-lg">
				<CardContent>
					<form className="space-y-4">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl font-bold text-center ">
								Welcome to Kalu
							</CardTitle>
							<CardDescription className="text-center">
								Enter your ID and password to login to your account
							</CardDescription>
						</CardHeader>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="msv">Email</Label>
								<Input
									id="msv"
									required
									type="text"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									required
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<div className="max-w-[30%">
									<Select>
										<SelectTrigger className="">
											<SelectValue placeholder="Student" ref={typeRef} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="student">Student</SelectItem>
											<SelectItem value="admmin">Admin</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button onClick={handleLogin} className="w-full" type="submit">
									Login
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginForm;
