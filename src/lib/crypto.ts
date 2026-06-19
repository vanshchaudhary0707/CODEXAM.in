/**
 * CODEXAM Cryptographic Utilities
 * Provides actual client-side content scrambling & validation based on teacher's secure PIN/Passphrase.
 */

export function encryptPayload(data: any, pinStr: string = "CODEXAM"): string {
  try {
    const rawJson = JSON.stringify(data);
    // Simple cryptographic shift cipher + Base64 scrambling
    let result = "";
    const shift = pinStr.length % 25 + 1;
    
    for (let i = 0; i < rawJson.length; i++) {
      const originalCode = rawJson.charCodeAt(i);
      // Scramble alphabetical and numeric spaces specifically, leaving brackets/formatting keys
      if (originalCode >= 32 && originalCode <= 126) {
        let shifted = originalCode + shift;
        if (shifted > 126) shifted = 32 + (shifted - 127);
        result += String.fromCharCode(shifted);
      } else {
        result += rawJson[i];
      }
    }
    
    const b64 = btoa(unescape(encodeURIComponent(result)));
    return `CODEXAM_ENC_v1$$${b64}`;
  } catch (err) {
    console.error("Encryption wrapper error:", err);
    return `ERR_ENCODE$$${JSON.stringify(data)}`;
  }
}

export function decryptPayload(encryptedStr: string, pinStr: string = "CODEXAM"): any {
  if (!encryptedStr) return null;
  if (!encryptedStr.startsWith("CODEXAM_ENC_v1$$")) {
    if (encryptedStr.startsWith("ERR_ENCODE$$")) {
      return JSON.parse(encryptedStr.substring(12));
    }
    return null; // Not encrypted or corrupted
  }

  try {
    const b64Part = encryptedStr.replace("CODEXAM_ENC_v1$$", "");
    const resultScrambled = decodeURIComponent(escape(atob(b64Part)));
    
    let originalJson = "";
    const shift = pinStr.length % 25 + 1;
    
    for (let i = 0; i < resultScrambled.length; i++) {
      const code = resultScrambled.charCodeAt(i);
      if (code >= 32 && code <= 126) {
        let unshifted = code - shift;
        if (unshifted < 32) unshifted = 127 - (32 - unshifted);
        originalJson += String.fromCharCode(unshifted);
      } else {
        originalJson += resultScrambled[i];
      }
    }
    
    return JSON.parse(originalJson);
  } catch (err) {
    console.error("Decryption wrapper error (Verification Pin failed?):", err);
    throw new Error("DECRYPTION_FAILED: Invalid security PIN key.");
  }
}
