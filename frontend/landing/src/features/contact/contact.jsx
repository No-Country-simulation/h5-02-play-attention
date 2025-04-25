"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { useState } from "react";

const formSchema = z.object({
  nombre: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres." }),
  correo: z.string().email({
    message: "Por favor ingresa un correo válido.",
  }),
  telefono: z.string().min(6, {
    message: "El teléfono debe tener al menos 6 caracteres.",
  }),
  institucion: z
    .string()
    .min(2, {
      message: "La institución debe tener al menos 2 caracteres.",
    })
    .max(50, { message: "La institución debe tener máximo 50 caracteres" }),
  interest: z.string({
    required_error: "Por favor selecciona un área de interés",
  }),
  message: z
    .string()
    .min(10, {
      message: "El mensaje debe tener al menos 10 caracteres.",
    })
    .max(1100, { message: "El mensaje debe tener máximo 1100 carácteres" }),
  terms: z.boolean().default(false),
});

export function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactUser, setContactUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      correo: "",
      telefono: "",
      institucion: "",
      interest: "",
      message: "",
      terms: false,
    },
  });

  const { reset } = form;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Mapeo correcto de datos según el schema
    const apiData = {
      fullname: data.nombre,
      company: data.institucion,
      phone: data.telefono,
      email: data.correo,
      service: data.interest,
      notes: data.message,
      status: "Nuevo",
      origen: "Web",
      relation: "Interesado",
    };

    // obtenemos primer nombre
    const firstName = data.nombre.split(" ")[0];
    setContactUser(firstName);

    try {
      const response = await fetch(
        "https://play-attention.onrender.com/api/leads/forms-website",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registro");
      }

      setSubmitSuccess(true);
      reset();
      setIsModalOpen(true);
    } catch (error) {
      setSubmitError(error.message || "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="m-h-[140vh] h-auto flex flex-col items-center bg-[#EFF6FF]">
      <h1 className="h-[8.27vh] flex items-center justify-center text-xl">
        Contactanos
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[75.23vw] h-[50.37%] bg-white md:p-6"
        >
          <h5 className="py-4 m-0">Solicita información</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-0 justify-items-stretch">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>Nombre Completo*</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-black rounded-none md:w-[32.86vw]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>Teléfono*</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-black rounded-none md:w-[32.86vw]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            <div className="space-y-4 md:justify-self-end">
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>
                      Correo electrónico*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border border-black rounded-none md:w-[32.86vw]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="institucion"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>
                      Institución (si aplica)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border border-black rounded-none md:w-[32.86vw]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <div className="m-0">
                <FormLabel className={"py-4"}>¿Quién lo va a usar?*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border border-black rounded-none">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sitio web">Sitio Web</SelectItem>
                    <SelectItem value="development">Desarrollo</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="support">Soporte al cliente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <div className="m-0">
                <FormLabel className={"py-4"}>Contexto de uso*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuéntanos brevemente para qué necesitas Play Attention"
                    className="min-h-[100px] border border-black rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Suscribirme al newsletter para recibir novedades y consejos
                  </FormLabel>
                </div>
                <FormMessage />
              </div>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mx-auto w-[62.73vw] h-[3.31%] rounded-none block"
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </form>
      </Form>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Formulario completado</DialogTitle>
            <DialogDescription>
              {contactUser} gracias por completar nuestro formulario de contacto
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>¡Nos pondremos en contacto contigo!</p>
            {submitError && <p className="text-red-500">{submitError}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
