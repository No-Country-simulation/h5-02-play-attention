"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useCallback, useMemo } from "react";

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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";

const formSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres." }),
  email: z.string().email({ message: "Por favor ingresa un correo válido." }),
  company: z
    .string()
    .min(2, { message: "La institución debe tener al menos 2 caracteres." })
    .max(50, { message: "La institución debe tener máximo 50 caracteres" }),
  service: z.string({
    required_error: "Por favor selecciona un área de interés",
  }),
  message: z
    .string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres." })
    .max(1100, { message: "El mensaje debe tener máximo 1100 carácteres" }),
  relation: z.string({ required_error: "Por favor selecciona tu relación" }),
});

const initialFormValues = {
  fullname: "",
  email: "",
  company: "",
  service: "",
  message: "",
  relation: "",
};

export const ContactSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactUser, setContactUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  const { reset } = form;

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      setSubmitError(null);

      const apiData = {
        message: data.message,
        fullname: data.fullname,
        company: data.company || "",
        email: data.email,
        service: data.service,
        relation: data.relation,
      };

      setContactUser(data.fullname.split(" ")[0]);

      try {
        const response = await fetch(
          "https://play-attention.onrender.com/api/leads/form-website",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    },
    [reset]
  );

  const formClasses = useMemo(
    () => ({
      root: "w-full md:w-[41.02%] min-h-[127%] bg-white border-2 border-[#C0B2CF] rounded-sm px-5 py-3 md:relative md:left-4 flex flex-col justify-evenly",
      input:
        "h-12 md:h-[4.62%] border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF]",
      textarea:
        "h-32 md:h-[18.01%] border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF]",
      label: "text-[0.9rem] text-[#15032A]",
      checkboxLabel: "text-[0.8rem] text-[#929292] py-2",
      smallText: "text-center text-[0.7rem] text-[#929292] py-2",
    }),
    []
  );

  return (
    <section className="border border-black w-full min-h-screen flex flex-col">
      <h1 className="text-center text-2xl md:text-[2rem] pt-4 [font-family:var(--font-sans)]">
        Contactanos
      </h1>
      <small className="text-center text-sm md:text-md pt-4 px-4 md:px-0">
        ¿Tienes preguntas sobre Play Attention? Estamos aquí para ayudarte
      </small>
      <div className="flex-1 py-8 md:py-20">
        <div className="bg-[#e9e9f1] w-full min-h-[70vh] md:h-[66vh] flex flex-col md:flex-row items-center justify-center md:items-center md:justify-evenly gap-8 md:gap-0 px-4 md:px-0">
          {/* Contenido izquierdo (visible solo en desktop) */}
          <div className="hidden md:block">datos 1</div>

          {/* Formulario (igual que tu versión original en desktop) */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={formClasses.root}
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <div>
                    <FormLabel className={formClasses.label}>Nombre*</FormLabel>
                    <FormControl>
                      <Input
                        className={formClasses.input}
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
                    <FormLabel className={`mt-3 ${formClasses.label}`}>
                      Correo electrónico*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={formClasses.input}
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
                    <FormLabel className={`mt-3 ${formClasses.label}`}>
                      Institución
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={formClasses.input}
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
                    <FormLabel className={`mt-3 ${formClasses.label}`}>
                      ¿Quién lo va a usar?
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className={`${formClasses.input} py-1`}>
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
                    <FormLabel className={`mt-3 ${formClasses.label}`}>
                      Contexto de uso
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Texto"
                        className={formClasses.textarea}
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
                  <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="
                        text-[#6d28d9]
                        bg-[#C0B2CF]
                        data-[state=checked]:text-white
                        data-[state=checked]:border-[#6d28d9]
                      "
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        className={`${formClasses.checkboxLabel} ${
                          field.value ? "text-[#15032A]" : "text-[#929292]"
                        }`}
                      >
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
                className="w-full h-12 md:h-[5.31%]"
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
              <small className={formClasses.smallText}>
                Al enviar este formulario, aceptas nuestra &nbsp;
                <b>Política de Privacidad</b> &nbsp; y el tratamiento de tus
                datos.
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
