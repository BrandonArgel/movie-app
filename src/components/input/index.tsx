import { useState } from "react";
import styles from "./input.module.scss";
import { Eye, EyeOff } from "assets/icons/icons";

type InputType = "text" | "password" | "email" | "number";

interface InputProps {
	autocomplete?: string;
	className?: string;
	disabled?: boolean;
	error?: string;
	icon: React.ReactNode;
	name: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	type: InputType;
	value: string;
}

const Input = ({
	autocomplete,
	className,
	error,
	icon,
	name,
	onChange,
	placeholder,
	type,
	value,
	disabled = false,
}: InputProps) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<>
			<div className={`${styles.input} ${error && styles.error}`}>
				{icon}
				<input
					id={name}
					name={name}
					onChange={onChange}
					placeholder={placeholder}
					type={showPassword ? "text" : type}
					value={value}
					className={`${styles.input__field} ${className}`}
					autoComplete={autocomplete}
				/>
				{type === "password" && (
					<button
						className={styles.input__show}
						onClick={() => setShowPassword(!showPassword)}
						type="button"
					>
						{showPassword ? <Eye /> : <EyeOff />}
					</button>
				)}
			</div>
			{/* {error && (
				<span className={styles.input__error}>
					<Alert />
					{error}
				</span>
			)} */}
		</>
	);
};

export { Input };
