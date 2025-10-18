'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Building2, CheckCircle, Download } from 'lucide-react';

function UploadCard({
  title,
  description,
  uploadUrl,
  onDownloadTemplate,
}: {
  title: string;
  description: string;
  uploadUrl: string;
  onDownloadTemplate?: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'text/csv') {
        setSelectedFile(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a .csv file.',
        });
        setSelectedFile(null);
        event.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" /> Success
          </div>
        ),
        description: `${data.inserted || 0} records uploaded successfully.`,
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: err.message || 'Something went wrong during upload.',
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              {title === 'Universities' ? <Building2 className="text-accent" /> : <FileText className="text-accent" />}
              {title} Data
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {onDownloadTemplate && (
            <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Template
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id={`file-upload-${title}`}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading}
          className="file:text-primary file:font-semibold"
        />
        {selectedFile && <p className="text-sm text-muted-foreground">Selected file: {selectedFile.name}</p>}
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
          {isUploading ? 'Uploading...' : <>
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </>}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { toast } = useToast();

  const handleUniversityTemplateDownload = () => {
    const headers = [
      "University Name", "Unique Code", "Image URL", "Location (City, Country)",
      "Full Address", "Established Year", "Type", "Partner University (Yes/No)",
      "Description", "Long Description", "Official Website", "Email", "Contact Number",
      "Application Fee Waived (Yes/No)", "US News & World Report", "QS Ranking",
      "THE (Times Higher Education)", "ARWU (Shanghai Ranking)", "Our Ranking",
      "Fields of Study (comma-separated)", "Program Offerings (IDs) (comma-separated IDs)",
      "Tuition Fees Min", "Tuition Fees Max", "Tuition Fees Currency",
      "Tuition Fees Notes", "Admission Requirements (use \"\" for multiline)",
      "Campus Life (use \"\" for multiline)"
    ];
    const csvHeader = headers.map(header => `"${header.replace(/"/g, '""')}"`).join(',');
    const blob = new Blob([csvHeader], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "university_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCourseTemplateDownload = () => {
    const headers = [
      "course_id", "title", "description", "category",
      "instructor", "duration", "firstYearTuitionFee",
      "tuitionFeeCurrency", "universityCode"
    ];
    const csvHeader = headers.map(header => `"${header}"`).join(',');
    const blob = new Blob([csvHeader], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "course_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-4xl font-bold mb-2 text-primary">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage university and course data from here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UploadCard
          title="Universities"
          description="Upload a CSV file with university information."
          uploadUrl="http://localhost:5000/api/universities/upload"
          onDownloadTemplate={handleUniversityTemplateDownload}
        />
        <UploadCard
          title="Courses"
          description="Upload a CSV file with course information."
          uploadUrl="http://localhost:5000/api/courses/upload"
          onDownloadTemplate={handleCourseTemplateDownload}
        />
      </div>
    </div>
  );
}
