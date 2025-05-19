"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardFooter, CardHeader } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Eye, EyeOff, LockIcon } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Mínimo 6 caracteres"),
  newPassword: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function PasswordCard() {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: errorsPwd },
    reset: resetPwd,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitPassword = (data) => {
    console.log("Cambio de contraseña:", data);
    setOpenPasswordModal(false);
    resetPwd();
  };

  return (
    <>
      <Card className="border-primary/40">
        <CardHeader>
          <h2 className="text-base font-semibold">Cambiar contraseña</h2>
          <p className="text-sm text-gray-500">Actualiza tu contraseña para mantener tu cuenta segura</p>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button variant="default" onClick={() => setOpenPasswordModal(true)}>
            <LockIcon className="w-4 h-4 mr-2" />               
            Cambiar contraseña
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={openPasswordModal} onOpenChange={setOpenPasswordModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPwd(onSubmitPassword)} className="space-y-4">
            <div>
              <Label className="mb-2">Contraseña actual</Label>
              <div className="relative">
                <Input type={showPwd.current ? "text" : "password"} {...registerPwd("currentPassword")}/>
                <button type="button" className="absolute right-2 top-2 text-gray-500" tabIndex={-1} onClick={() => setShowPwd(p => ({...p, current: !p.current}))}>
                  {showPwd.current ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              {errorsPwd.currentPassword && <span className="text-xs text-red-500">{errorsPwd.currentPassword.message}</span>}
            </div>
            <div>
              <Label className="mb-2">Nueva contraseña</Label>
              <div className="relative">
                <Input type={showPwd.new ? "text" : "password"} {...registerPwd("newPassword")}/>
                <button type="button" className="absolute right-2 top-2 text-gray-500" tabIndex={-1} onClick={() => setShowPwd(p => ({...p, new: !p.new}))}>
                  {showPwd.new ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              {errorsPwd.newPassword && <span className="text-xs text-red-500">{errorsPwd.newPassword.message}</span>}
            </div>
            <div>
              <Label className="mb-2">Confirmar nueva contraseña</Label>
              <div className="relative">
                <Input type={showPwd.confirm ? "text" : "password"} {...registerPwd("confirmPassword")}/>
                <button type="button" className="absolute right-2 top-2 text-gray-500" tabIndex={-1} onClick={() => setShowPwd(p => ({...p, confirm: !p.confirm}))}>
                  {showPwd.confirm ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              {errorsPwd.confirmPassword && <span className="text-xs text-red-500">{errorsPwd.confirmPassword.message}</span>}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button type="submit" className="w-full">Actualizar contraseña</Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setOpenPasswordModal(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 