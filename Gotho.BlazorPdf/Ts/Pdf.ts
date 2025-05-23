import {PDFDocumentProxy, getFilenameFromUrl} from "pdfjs-dist"
import {PdfState} from "./PdfState";
import {PdfDrawLayer} from "./PdfDrawLayer";

const pdfInstances = {}

export class Pdf {

    public id: string;
    public canvas: any;
    public scale: number;
    public rotation: number;
    public url: string;
    public filename: string;
    public document: PDFDocumentProxy;

    public renderInProgress: boolean;
    public singlePageMode: boolean;
    public pageCount: number;
    public currentPage: number;
    public queuedPage: number;
    public password: string;
    public source: string;
    
    public drawLayer: PdfDrawLayer;

    constructor(id: string, scale: number, rotation: number, url: string, singlePageMode: boolean, source: string, password: string = null) {
        this.id = id;
        this.canvas = Pdf.getCanvas(id);
        this.scale = scale;
        this.rotation = rotation;
        this.url = url;
        this.filename = getFilenameFromUrl(url)
        this.document = null;
        this.renderInProgress = false;
        this.singlePageMode = singlePageMode;
        this.pageCount = 0;
        this.currentPage = 1;
        this.queuedPage = null;
        this.source = source.toLowerCase();
        this.password = password
        this.drawLayer = new PdfDrawLayer(id);

        pdfInstances[this.id] = this;
    }

    public static getPdf(id: string): Pdf {
        const canvas = this.getCanvas(id);
        // @ts-ignore
        return Object.values(pdfInstances).filter((c) => c.canvas === canvas).pop();
    }

    public updatePdf(dto: PdfState)
    {
        this.rotation = dto.orientation;
        this.scale = dto.scale;
        this.currentPage = dto.currentPage;
    }

    public setDocument(doc: PDFDocumentProxy) {
        this.document = doc;
        this.pageCount = doc.numPages;
    }

    public firstPage(): boolean {
        if (this.document == null || this.currentPage == 1) {
            return false;
        }

        if (this.currentPage > 1)
            this.currentPage = 1;

        return true;
    }

    public lastPage(): boolean {
        if (this.document == null || (this.currentPage == 1 && this.currentPage === this.pageCount)) {
            return false;
        }

        if (this.currentPage < this.pageCount)
            this.currentPage = this.pageCount;

        return true;
    }

    public nextPage(): boolean {
        if (this.document === null || this.currentPage === this.pageCount)
            return false;

        if (this.currentPage < this.pageCount)
            this.currentPage += 1;

        return true;
    }

    public previousPage(): boolean {
        if (this.document == null || this.currentPage === 0 || this.currentPage === 1) {
            return false;
        }

        if (this.currentPage > 0) {
            this.currentPage -= 1;
        }

        return true;
    }

    public gotoPage(pageNumber: number): boolean {
        if (this.document == null || pageNumber < 1 || pageNumber > this.pageCount) {
            return false;
        }

        this.currentPage = pageNumber;
        return true;
    }

    public rotate(rotation: number) {
        if (rotation % 90 === 0)
            this.rotation = rotation;
    }

    public zoom(scale: number) {
        this.scale = scale;
    }
    
    public getCanvasContext(): any {
        return this.canvas.getContext("2d");
    }

    private static getCanvas(id: any) {
        if (this.isDomSupported() && typeof id === 'string') {
            id = document.getElementById(id);
        } else if (id && id.length) {
            // support for array based queries
            id = id[0];
        }

        if (id && id.canvas !== undefined && id.canvas) {
            // support for any object associated to a canvas (including a context2d)
            id = id.canvas;
        }

        return id;
    }

    private static isDomSupported(): boolean {
        return true;
    }
}