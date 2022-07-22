import * as React from "react";
import { Link } from "react-router-dom";
import { Loader } from "components/loader";
import styles from "./button.module.scss";

type size = "small" | "medium" | "large";

interface ButtonProps {
	anchor?: boolean;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	url?: string;
	link?: boolean;
	loading?: boolean;
	onClick?: () => void;
	rel?: string;
	size?: size;
	target?: string;
	type?: string;
}

const Button = (props: ButtonProps) => {
	const {
		anchor,
		children,
		className = "",
		disabled = false,
		link = false,
		loading = false,
		onClick,
		url = "",
		type = "button",
		...rest
	} = props;

	if (link) {
		return (
			<Link to={url} className={`${styles.button} ${className}`} {...rest}>
				{loading ? <Loader /> : children}
			</Link>
		);
	}

	return React.createElement(
		anchor ? "a" : "button",
		{
			...rest,
			className: `${styles.button} ${className}`,
			disabled,
			onClick,
			type,
			href: url,
		},
		children,
		loading && <Loader />
	);
};

export { Button };
