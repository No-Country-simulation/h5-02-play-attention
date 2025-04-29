"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function Footer() {
  return (
    <footer className="w-full bg-neutral-white-500 py-4 px-4 lg:px-20">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <img src="/logo-deeper-v2.png" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Copyright */}
        <div className="flex mb-4 text-center text-sm text-secondary-800 md:mb-0 space-x-4">
          <div className="flex h-5 items-center space-x-2 text-sm">
            <div>Copyright © {new Date().getFullYear()} Play Attetion</div>
            <Separator orientation="vertical" />
            <div>All Rights Reserved</div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-2">
          <Button
            size="icon"
            className="bg-secondary-800"
            asChild
            aria-label="Facebook"
          >
            <Link
              href="https://www.facebook.com/profile.php?id=100063829610982"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook
                className="h-5 w-5 text-neutral-white-100"
                fill="white"
              />
            </Link>
          </Button>
          {/* <Button
            size="icon"
            className="bg-secondary-800"
            asChild
            aria-label="Twitter"
          >
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Twitter
                className="h-5 w-5 text-neutral-white-100"
                fill="white"
              />
            </Link>
          </Button> */}
          <Button
            size="icon"
            className="bg-secondary-800"
            asChild
            aria-label="Instagram"
          >
            <Link
              href="https://www.instagram.com/dislexiayconducta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5 text-neutral-white-100" />
            </Link>
          </Button>
          {/* <Button
            size="icon"
            className="bg-secondary-800"
            asChild
            aria-label="LinkedIn"
          >
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5 text-neutral-white-100" fill="white"/>
            </Link>
          </Button> */}
          {/* <Button
            size="icon"
            className="bg-secondary-800"
            asChild
            aria-label="YouTube"
          >
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-5 w-5 text-neutral-white-100" />
            </Link>
          </Button> */}
        </div>
      </div>
    </footer>
  );
}
