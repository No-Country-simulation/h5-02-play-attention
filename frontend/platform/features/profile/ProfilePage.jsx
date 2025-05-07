"use client";

import { useState, useEffect } from "react";
import ProfileCard from "./components/ProfileCard";
import PasswordCard from "./components/PasswordCard";

const DEFAULT_PROFILE = {
  name: "Jose Roman Valdez",
  email: "joseuser.01@example.com",
  phone: "+34 612 345 678",
  profession: "Psicólogo",
  organization: "Centro Educativo San José María",
};

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener los datos del usuario desde la cookie
  useEffect(() => {
    setIsLoading(true);
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='));

    if (userCookie) {
      try {
        const userInfo = JSON.parse(
          decodeURIComponent(userCookie.split('=')[1])
        );
        setUserData(userInfo);
        setInitialValues({
          name: userInfo.name || "",
          email: userInfo.email || "",
          phone: "",
          profession: "",
          organization: "",
        });
      } catch (error) {
        console.error('Error al leer la cookie user_info:', error);
        setInitialValues(DEFAULT_PROFILE);
      }
    } else {
      setInitialValues(DEFAULT_PROFILE);
    }
    setTimeout(() => setIsLoading(false), 500); // Simula carga
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-1">Mi Perfil</h1>
      <p className="text-gray-500 mb-6">Administra tu información personal y preferencias de notificaciones</p>
      <ProfileCard
        initialValues={initialValues}
        isLoading={isLoading}
        userData={userData}
      />
      <PasswordCard />
    </div>
  );
} 