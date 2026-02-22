import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(10, "Telefone inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;





