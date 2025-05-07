"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Label } from "@/shared/ui/label";
import { SaveIcon } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";

const profileSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(7, "Teléfono inválido"),
  profession: z.string().min(2, "Profesión obligatoria"),
  organization: z.string().min(2, "Organización obligatoria"),
});

export default function ProfileCard({ initialValues, isLoading, userData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const onSubmit = (data) => {
    console.log("Perfil actualizado:", data);
  };

  return (
    <Card className="mb-6 border-primary/40">
      <CardHeader>
        <h2 className="text-lg font-semibold">Información personal</h2>
        <p className="text-sm text-gray-500">Actualiza tu información personal y datos de contacto.</p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-28 h-28">
              <AvatarImage src="/avatar-placeholder.jpg" alt="avatar" />
              <AvatarFallback>{userData?.name?.charAt(0) || ""}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <div>
              <Label className="mb-2">Nombre completo</Label>
              {isLoading ? <Skeleton className="h-10 w-full rounded-md" /> : <Input {...register("name")}/>} 
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
            <div>
              <Label className="mb-2">Correo electrónico</Label>
              {isLoading ? <Skeleton className="h-10 w-full rounded-md" /> : <Input {...register("email")}/>} 
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
            <div>
              <Label className="mb-2">Teléfono</Label>
              {isLoading ? <Skeleton className="h-10 w-full rounded-md" /> : <Input {...register("phone")}/>} 
              {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
            </div>
            <div>
              <Label className="mb-2">Profesión</Label>
              {isLoading ? <Skeleton className="h-10 w-full rounded-md" /> : <Input {...register("profession")}/>} 
              {errors.profession && <span className="text-xs text-red-500">{errors.profession.message}</span>}
            </div>
            <div className="lg:col-span-2">
              <Label className="mb-2">Organización</Label>
              {isLoading ? <Skeleton className="h-10 w-full rounded-md" /> : <Input {...register("organization")}/>} 
              {errors.organization && <span className="text-xs text-red-500">{errors.organization.message}</span>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            <SaveIcon className="w-4 h-4 mr-2" />          
            Guardar cambios
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 