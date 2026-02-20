/**
 * Simulates hashing a password using SHA-256.
 * In a real application, this should be done on the backend, or using a secure library.
 * This function uses the Web Crypto API to generate a real hash for demonstration.
 * 
 * @param password The raw password string
 * @returns The SHA-256 hex hash string
 */
export async function hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);

    // Hash the password with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert the buffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}
