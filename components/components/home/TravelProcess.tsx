"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TravelProcess() {
  return (
    <section className="bg-white py-16 sm:py-huge overflow-hidden">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="pill-tag mb-4 inline-block">Your Journey</span>
          <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
            Your Medical Journey to India
          </h2>
          <p className="text-body-md sm:text-body-lg text-shade-50 max-w-2xl mx-auto mt-3 sm:mt-4">
            A simple 7-step process for international patients travelling to India for treatment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full"
        >
          <div className="w-full overflow-hidden rounded-lg">
            <Image
              src="/images/travelprocessdesktop.jpg"
              alt="Medical travel journey to India"
              width={1200}
              height={600}
              className="w-full h-auto block"
              style={{
                clipPath: "inset(6% 0 6% 0)",
                marginTop: "-6%",
                marginBottom: "-6%",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
