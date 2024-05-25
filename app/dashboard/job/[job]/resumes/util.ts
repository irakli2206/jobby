import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/client"
import saveAs from "file-saver"
import JSZip from "jszip"

export const downloadAllResumes = async (resumes: any, jobId: string) => {
    const supabase = createClient()

    const resumePromises: Promise<any>[] = []
    resumes.forEach((resume: any) => {
        resumePromises.push(supabase.storage.from('jobs').download(`resumes/${jobId}/${resume.name}`))
    })

    const response = await Promise.allSettled(resumePromises)

    const downloadedFiles = response.map((result, index) => {
        if (result.status === "fulfilled") {
            return {
                name: resumes[index].name,
                blob: result.value.data,
            };
        }
    });

    const zip = new JSZip();
    const allResumes = zip.folder('resumes')

    downloadedFiles.forEach((downloadedFile) => {
        if (downloadedFile) {
            allResumes?.file(downloadedFile.name, downloadedFile.blob);
        }
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, "resumes.zip");
    });
}


export const downloadResume = async (name: string, jobId: string) => {
    const supabase = createClient()

    const { data } = await supabase.storage.from('jobs').download(`resumes/${jobId}/${name}`)

    const url = window.URL.createObjectURL(data);

    // Create an anchor element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = name; // Specify the file name

    // Append the anchor to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the anchor to trigger the download
    link.click();

    // Remove the anchor from the document
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    window.URL.revokeObjectURL(url);


}


export const deleteResume = async (name: string, jobId: string) => {
    const supabase = createClient()


    const { data, error } = await supabase.storage.from('jobs').remove([`resumes/${jobId}/${name}`])
    console.log(`jobs/resumes/${jobId}/${name}`)
    if (error) {
        throw new Error(error.message)
    }
 

}