import { GitHub, Instagram, Linkedin, Mail, Platzi, Twitter, Portfolio } from "assets/icons/social";

export const API_BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE_URL = "https://image.tmdb.org/t/p";
export const DEFAULT_IMAGE = "https://movies-platzi-app.netlify.app/default_image.jpg";
export const DEFAULT_BANNER = "https://coolwallpapers.me/th700/1030538-curtain.jpg";

export const Social = [
	{
		link: "https://www.instagram.com/brandargel/",
		icon: <Instagram />,
		title: "Brandon Argel's Instagram",
	},
	{
		link: "https://brandonargel.me",
		icon: <Portfolio />,
		title: "Brandon Argel's Portfolio",
	},
	{
		link: "https://platzi.com/p/BrandArgel/",
		icon: <Platzi />,
		title: "Brandon Argel's Platzi Profile",
	},
	{
		link: "https://github.com/BrandonArgel",
		icon: <GitHub />,
		title: "Brandon Argel's GitHub",
	},
	{
		link: "https://www.linkedin.com/in/brandargel/",
		icon: <Linkedin />,
		title: "Brandon Argel's LinkedIn",
	},
	{
		link: "https://twitter.com/BrandArgel",
		icon: <Twitter />,
		title: "Brandon Argel's Twitter",
	},
	{
		link: "mailto:brandargel@gmail.com",
		icon: <Mail />,
		title: "Brandon Argel's Email",
	},
];
