import React from "react";
import { Routes, Route } from "react-router";
import { Layout } from "../pages/layout/index";
import { HomePage } from "../pages/home/index";
import { Login } from "../pages/login";
import { Profile } from "../pages/profile";
import { Regist } from "../pages/regist";
import { EditProfile } from "../pages/edit-profile";
import { ResetPassword } from "../pages/reset-password";
import { EnterEmail } from "../pages/reset-pass-enter-email";
import { EnterCode } from "../pages/reset-pass-enter-code";

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route path="login" element={<Login />} />
				<Route path="profile" element={<Profile />} />
				<Route path="regist" element={<Regist />} />
				<Route path="edit-profile" element={<EditProfile />} />
				<Route path="reset-password" element={<ResetPassword />} />
				<Route path="enter-email" element={<EnterEmail />} />
				<Route path="enter-code" element={<EnterCode />} />
			</Route>
		</Routes>
	);
}
export { AppRoutes };
