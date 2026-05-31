import multer from 'multer';

// Upload de imagens de entregas (Fase 7).
// Usamos memoryStorage: o arquivo nunca toca o disco em sua forma original — o
// buffer é validado por magic bytes e reprocessado pelo sharp antes de gravar
// (ver image.util). Isso evita salvar conteúdo malicioso com extensão forjada.
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB por imagem
const MAX_FILES = 10; // máximo de imagens por versão de entrega

export const uploadDeliveryImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  // Pré-filtro leve pelo mimetype declarado; a validação real (magic bytes)
  // acontece no image.util. Aqui só barramos o óbvio para não desperdiçar memória.
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Apenas arquivos de imagem são permitidos'));
  },
}).array('images', MAX_FILES);
