import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFinanceAttachmentUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAttachment = async (
    file: File,
    ownerType: string,
    ownerId: string | null,
    voucherNumber?: string | null,
  ) => {
    setIsUploading(true);
    try {
      const year = new Date().getFullYear().toString();
      const safeName = file.name.replace(/\s+/g, "_");
      const owner = ownerId ?? "default";
      const path = `${ownerType}/${owner}/${year}/${voucherNumber || "bilag"}/${Date.now()}-${safeName}`;

      const { data, error } = await supabase.storage
        .from("finance-bilag")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;

      // Bucket is private — use signed URL valid for 1 year (renewable on read).
      const { data: signed, error: signErr } = await supabase.storage
        .from("finance-bilag")
        .createSignedUrl(data.path, 60 * 60 * 24 * 365);
      if (signErr) throw signErr;

      return { url: signed.signedUrl, path: data.path, name: file.name };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAttachment, isUploading };
}
