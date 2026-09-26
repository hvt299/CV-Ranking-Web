import MainLayout from "@/components/layout/MainLayout";

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>{children}</MainLayout>
    );
}