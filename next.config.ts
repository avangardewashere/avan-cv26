import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * There is an unrelated package-lock.json in the home directory, which
   * Turbopack would otherwise treat as the workspace root — pulling the whole
   * of C:\Users\USER into the module graph.
   */
  turbopack: {
    root: path.resolve("."),
  },
  poweredByHeader: false,
};

export default nextConfig;
