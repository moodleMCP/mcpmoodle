import { moodleCall } from '../moodleClient.js';
import { z } from 'zod';
import { UploadFileInput } from '../utils/validators.js';

/** Nota: para subidas reales, suele requerirse un draft itemid/context. Este wrapper usa core_files_upload si el servicio lo permite. */
export async function upload_file(args: z.infer<typeof UploadFileInput>) {
  // Para simplificar, asumimos filepath es base64 (data) o una ruta accesible por el servidor.
  // En entornos productivos, implementa la carga multi-parte y gestión de itemid/contextid.
  const res = await moodleCall('core_files_upload', {
    filearea: args.filearea ?? 'draft',
    contextid: args.contextid ?? 1,
    filepath: '/',
    filename: args.filename,
    filecontent: args.filepath, // base64
  });
  return { url: res?.url ?? null, result: res };
}
