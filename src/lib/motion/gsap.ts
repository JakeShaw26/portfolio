"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once for the whole client bundle. useGSAP() handles cleanup of
// any tweens/ScrollTriggers created in its scope, which is the main
// GSAP-in-React footgun under React 19 strict mode.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
