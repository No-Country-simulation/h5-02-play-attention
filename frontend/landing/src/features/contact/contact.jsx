"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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

const formSchema = z.object({
  fullname: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres." }),
  email: z.string().email({
    message: "Por favor ingresa un correo válido.",
  }),
  phone: z.string().min(6, {
    message: "El teléfono debe tener al menos 6 caracteres.",
  }),
  company: z
    .string()
    .min(2, {
      message: "La institución debe tener al menos 2 caracteres.",
    })
    .max(50, { message: "La institución debe tener máximo 50 caracteres" }),
  service: z.string({
    required_error: "Por favor selecciona un área de interés",
  }),
  message: z
    .string()
    .min(10, {
      message: "El mensaje debe tener al menos 10 caracteres.",
    })
    .max(1100, { message: "El mensaje debe tener máximo 1100 carácteres" }),
  relation: z.string({
    required_error: "Por favor selecciona tu relación",
  }),
});

export const ContactSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactUser, setContactUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
      relation: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    setSubmitError(null);

    const apiData = {
      message: data.message,
      fullname: data.fullname,
      company: data.company || "",
      phone: data.phone,
      email: data.email,
      service: data.service,
      relation: data.relation,
    };

    // obtenemos primer nombre
    const firstName = data.fullname.split(" ")[0];
    setContactUser(firstName);

    try {
      const response = await fetch(
        "https://play-attention.onrender.com/api/leads/form-website",
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
    <section className="border border-black w-screen h-auto ">
      <h1>Contactanos</h1>
      <p>¿Tienes preguntas sobre Play Attention? Estamos aquí para ayudarte</p>
      <div className="bg-[#e9e9f1] w-screen h-[60%]">
        <div>datos</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[75.23vw] h-[50.37%] bg-white md:p-6"
          >
            <FormField
              control={form.control}
              name="fullname"
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
              name="email"
              render={({ field }) => (
                <div>
                  <FormLabel className={"py-3"}>Correo electrónico*</FormLabel>
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
              name="phone"
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

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <div>
                  <FormLabel className={"py-3"}>Empresa/Institución</FormLabel>
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
              name="service"
              render={({ field }) => (
                <div className="m-0">
                  <FormLabel className={"py-4"}>Servicio de interés*</FormLabel>
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
                      <SelectItem value="Profesional">Profesional</SelectItem>
                      <SelectItem value="Individuo">Individuo</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <div className="m-0">
                  <FormLabel className={"py-4"}>Tu relación*</FormLabel>
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
                      <SelectItem value="Director">Director</SelectItem>
                      <SelectItem value="Profesor">Profesor</SelectItem>
                      <SelectItem value="Padre/Madre">Padre/Madre</SelectItem>
                      <SelectItem value="Terapeuta">Terapeuta</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
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
                  <FormLabel className={"py-4"}>Mensaje*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hola, necesito ayuda con..."
                      className="min-h-[100px] border border-black rounded-none"
                      {...field}
                    />
                  </FormControl>
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
      </div>

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
};
