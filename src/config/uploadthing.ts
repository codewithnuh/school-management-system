import { createUploadthing, type FileRouter } from 'uploadthing/express'

const f = createUploadthing()

// Define the error handler
const handleError = (error: Error) => {
    console.error('Error in file upload:', error)
    return { message: 'Upload failed' }
}

export const uploadRouter = {
    // FileRoute for handling PDF uploads
    pdfUploader: f({
        pdf: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        .middleware(({ req }) => {
            // This code runs on your server before upload
            console.log('Upload request received for PDF')

            // You can add authentication checking here if needed
            // const user = req.user;
            // if (!user) throw new Error("Unauthorized");

            // Return metadata that will be accessible in onUploadComplete
            return { uploadedAt: new Date().toISOString() }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code runs on your server after upload completes
            console.log('Upload completed:', file.url)
            console.log('Uploaded at:', metadata.uploadedAt)

            // Return data that will be sent back to the client
            return {
                uploadedAt: metadata.uploadedAt,
                url: file.url,
            }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
