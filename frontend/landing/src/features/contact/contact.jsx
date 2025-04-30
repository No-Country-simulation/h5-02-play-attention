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
import { StaticContact } from "./staticContact";

const formSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Por favor ingresa un correo válido." }),
  company: z
    .string()
    .min(2, { message: "La compañía debe tener al menos 2 caracteres." })
    .max(50, { message: "La compañía debe tener máximo 50 caracteres" }),
  institution: z.string({
    required_error: "Por favor selecciona una institución",
  }),
  service: z.string().optional(),
  message: z
    .string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres." })
    .max(1100, { message: "El mensaje debe tener máximo 1100 carácteres" }),
  relation: z.string({ required_error: "Por favor ingresa tu relación" }),
  terms: z.boolean().optional(),
});

const initialFormValues = {
  fullname: "",
  phone: "",
  email: "",
  company: "",
  institution: "",
  service: "",
  message: "",
  relation: "",
  newsletter: false,
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

      // Estructura que espera el backend
      const apiData = {
        message: data.message,
        fullname: data.fullname,
        company: data.company || "",
        phone: data.phone || "",
        email: data.email,
        service: data.service || "", // Ahora service es opcional
        relation: data.relation,
        newsletter: data.newsletter,
      };
      console.log(apiData);

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
      root: "w-full md:w-[41.02%] min-h-[121%] bg-white border-2 border-[#C0B2CF] rounded-sm px-5 py-3 md:relative md:left-4 flex flex-col justify-evenly",
      input:
        "h-12 md:h-[4.62%] md:min-h-8 border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF]",
      textarea:
        "h-32 md:h-[18.01%] border-1 border-[#C0B2CF] placeholder:text-[0.9rem] placeholder:text-[#C0B2CF]",
      label: "text-[0.9rem] text-[#15032A]",
      checkboxLabel: "text-[0.8rem] text-[#929292] py-2",
      smallText: "text-center text-[0.7rem] text-[#929292] py-2",
      gridRow: "grid grid-cols-1 md:grid-cols-2 gap-4",
    }),
    []
  );

  return (
    <section className="w-full min-h-screen flex flex-col">
      <h1 className="text-center text-2xl md:text-[2rem] pt-4 [font-family:var(--font-sans)] font-[700]">
        Contactanos
      </h1>
      <small className="text-center text-sm text-[#656573] md:text-md pt-4 px-4 md:px-0 [font-family:var(--font-sans)] font-[400]">
        ¿Tienes preguntas sobre Play Attention? Estamos aquí para ayudarte
      </small>
      <div className="flex-1 py-8 md:py-20">
        <div className="bg-[#e9e9f1] w-full min-h-[70vh] md:h-[66vh] flex flex-col md:flex-row items-center justify-center md:items-center md:justify-evenly gap-8 md:gap-0 px-4 md:px-0">
          <StaticContact />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={formClasses.root}
            >
              <div className={formClasses.gridRow}>
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <div>
                      <FormLabel className={formClasses.label}>
                        Nombre Completo*
                      </FormLabel>
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
                  name="phone"
                  render={({ field }) => (
                    <div>
                      <FormLabel className={formClasses.label}>
                        Teléfono*
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={formClasses.input}
                          {...field}
                          placeholder="+34 123456789"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>

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

              <div className={formClasses.gridRow}>
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <div>
                      <FormLabel className={`mt-3 ${formClasses.label}`}>
                        Institución*
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={formClasses.input}>
                            <SelectValue
                              placeholder={
                                <span className="text-[#C0B2CF]">
                                  Selecciona institución
                                </span>
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Profesional">
                            Profesional
                          </SelectItem>
                          <SelectItem value="Persona individual">
                            Persona Individual
                          </SelectItem>
                          <SelectItem value="Empresa">Empresa</SelectItem>
                        </SelectContent>
                      </Select>
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
                        Compañía*
                      </FormLabel>
                      <FormControl>
                        <Input className={formClasses.input} {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="relation"
                render={({ field }) => (
                  <div>
                    <FormLabel className={`mt-3 ${formClasses.label}`}>
                      Relación*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={formClasses.input}
                        {...field}
                        placeholder="Padre del usuario"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <div>
                    <FormLabel className={`mt-3 ${formClasses.label}`}>
                      Contexto de uso
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={formClasses.textarea}
                        {...field}
                        placeholder="Buenas tardes, me comunico por..."
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="newsletter"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="
                      border-[#929292]"
                    />
                    <label
                      htmlFor="newsletter"
                      className={`text-[0.7rem] font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        field.value ? "text-[#6d28d9]" : "text-[#929292]"
                      }`}
                    >
                      Quiero recibir novedades, actualizaciones y ofertas
                      especiales de Play Attention
                    </label>
                  </div>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-6"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
              <small className={formClasses.smallText}>
                Al enviar este formulario, aceptas nuestra{" "}
                <b>Política de Privacidad </b> y el tratamiento de tus datos.
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
