"use client";
import Link from "next/link";
// import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FaFacebookF, FaYoutube } from 'react-icons/fa';
import { BiLogoInstagramAlt } from "react-icons/bi";

export function Footer() {
  return (
    <footer className="w-full bg-neutral-white-500 py-4 px-4 lg:px-20">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <img src="/logo.jpg" alt="Logo" className="h-12 w-auto rounded-full" />
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
              href="https://www.facebook.com/myplayattention/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF
                className="h-8 w-8 text-neutral-white-100"
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
                className="h-8 w-8 text-neutral-white-100"
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
              href="https://www.instagram.com/playattentionargentina"
              target="_blank"
              rel="noopener noreferrer"
            >

              <BiLogoInstagramAlt className="h-8 w-8 text-neutral-white-100" />
            </Link>
          </Button>
          {/* <Button
            size="icon"
            className="bg-secondary-800"
            asChild
            aria-label="LinkedIn"
          >
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-8 w-8 text-neutral-white-100" fill="white"/>
            </Link>
          </Button> */}
          <Button
            size="icon"
            className="bg-secondary-800"
            asChild
            aria-label="YouTube"
          >
            <Link href="https://www.youtube.com/@playattention888" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="h-8 w-8 text-neutral-white-100" />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
