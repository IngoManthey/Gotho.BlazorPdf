namespace Gotho.BlazorPdf.Docs.Code;

public static class QuickStart
{
    public static string Package => 
@"dotnet add package Gotho.BlazorPdf";
    
    public static string ProgramCs =>
@"builder.Services.AddBlazorPdfViewer();";
    
    public static string AppRazor =>
@"<link href=""_content/Gotho.BlazorPdf/blazorpdf.min.css"" rel=""stylesheet""/>";
    
    public static string ImportRazor =>
@"@using Gotho.BlazorPdf";
    
    public static string Minimum =>
@"<PdfViewer Url=""https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf""/>";
    
    public static string Maui =>
@"builder.Services.AddBlazorPdfViewer(opt => 
{
    opt.UseProjectWorker = true
});";

    public static string Manual =>
@"<PdfViewer @ref=""_pdfViewer""/>

@code {

    private PdfViewer _pdfViewer;
    
    protected override Task OnInitializedAsync()
    {
        url = PdfBase64String.File;
        await _pdfViewer.LoadPdfAsync(url);
        StateHasChanged();
    }
}";
}