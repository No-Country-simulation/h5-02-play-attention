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
  // phone: z.string().min(6, {
  //   message: "El teléfono debe tener al menos 6 caracteres.",
  // }),
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
      // phone: "",
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
      // phone: data.phone,
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
    <section className=" w-screen min-h-[max-content] h-auto flex flex-col">
      <h1 className="text-center pt-4 ">Contactanos</h1>
      <small className="text-center pt-4">
        ¿Tienes preguntas sobre Play Attention? Estamos aquí para ayudarte
      </small>
      <div className="box-border h-[min-content] py-20">
        <div className="bg-[#e9e9f1] w-screen h-[60vh] flex items-center justify-evenly ">
          <div>datos 1</div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="min-h-[127.1137%]  max-h-[127.1137%] w-[36.02%] bg-white border-2 border-[#C0B2CF] shadow-[0_0_3px_#C0B2CF] rounded-sm p-5 relative left-4 flex flex-col justify-evenly"
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"text-[0.9rem] text-[#15032A] "}>
                      Nombre*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "h-[4.62%] border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF]"
                        }
                        {...field}
                        placeholder="Tu nombre completo"
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
                    <FormLabel className={"mt-4 text-[0.9rem] text-[#15032A]"}>
                      Correo electrónico*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "h-[4.62%] border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF] "
                        }
                        {...field}
                        placeholder="tu@email.com"
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
                    <FormLabel className={"mt-4 text-[0.9rem] text-[#15032A]"}>
                      Institución
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "h-[4.62%]  border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF] "
                        }
                        {...field}
                        placeholder="Nombre de institución o empresa"
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
                    <FormLabel className={"mt-4 text-[0.9rem] text-[#15032A]"}>
                      ¿Quién lo va a usar?
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl
                        className={
                          "h-[4.62%] border-1 border-[#C0B2CF] text-[0.9rem] py-1"
                        }
                      >
                        <SelectTrigger className="text-[#C0B2CF]">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="Profesional"
                          className="text-[#A592B5]"
                        >
                          Profesional
                        </SelectItem>
                        <SelectItem
                          value="Individuo"
                          className="text-[#A592B5]"
                        >
                          Individuo
                        </SelectItem>
                        <SelectItem value="Empresa" className="text-[#B0A2C0]">
                          Empresa
                        </SelectItem>
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
                    <FormLabel className={"mt-4 text-[0.9rem] text-[#15032A]"}>
                      Contexto de uso
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Texto"
                        className={
                          "h-[18.01%]  border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF]"
                        }
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
                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                    {" "}
                    {/* Eliminé border */}
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-none" // Asegura que el checkbox no tenga borde
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-[0.7rem] text-[#929292] py-1">
                        {" "}
                        {/* Cambié a morado */}
                        Quiero recibir novedades, actualizaciones y ofertas
                        especiales de Play Attention
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </div>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className=" w-full h-[5.31%]"
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
              <small className="text-center text-[0.7rem] py-1">
                Al enviar este formulario, aceptas nuestra Política de
                Privacidad y el tratamiento de tus datos.
              </small>
            </form>
          </Form>
        </div>
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
