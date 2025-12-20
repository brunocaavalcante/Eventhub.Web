import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropZoneImageComponent } from './drop-zone-image.component';

describe('DropZoneImageComponent', () => {
  let component: DropZoneImageComponent;
  let fixture: ComponentFixture<DropZoneImageComponent>;
  const mockBase64 = 'data:image/png;base64,MOCK';
  const originalFileReader = window.FileReader;

  beforeAll(() => {
    class FileReaderStub {
      result: string | ArrayBuffer | null = mockBase64;
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null;

      readAsDataURL(): void {
        this.onload?.({ target: { result: this.result } } as ProgressEvent<FileReader>);
      }
    }

    const fileReaderCtor = FileReaderStub as unknown as typeof FileReader;
    window.FileReader = fileReaderCtor;
  });

  afterAll(() => {
    window.FileReader = originalFileReader;
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [DropZoneImageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DropZoneImageComponent);
    component = fixture.componentInstance;
  });

  const createFileList = (quantidade: number): FileList => {
    const files = Array.from({ length: quantidade }, (_, index) => new File(['conteudo'], `imagem-${index}.png`, { type: 'image/png' }));
    const fileList: Partial<FileList> = {
      length: files.length,
      item: (index: number) => files[index] ?? null
    };

    files.forEach((file, index) => {
      (fileList as any)[index] = file;
    });

    return fileList as FileList;
  };

  it('deve adicionar imagens até o limite e emitir mudanças', () => {
    const emitSpy = jest.spyOn(component.imagensChange, 'emit');

    component.handleFiles(createFileList(2));

    expect(component.imagens.length).toBe(2);
    expect(component.imagens.every(img => img === mockBase64)).toBe(true);
    expect(emitSpy).toHaveBeenCalledTimes(2);
    const ultimaEmissao = emitSpy.mock.calls[emitSpy.mock.calls.length - 1]?.[0];
    expect(ultimaEmissao).toEqual(component.imagens);
  });

  it('não deve adicionar novas imagens quando o limite já foi atingido', () => {
    component.imagens = Array.from({ length: 10 }, (_, index) => `${mockBase64}-${index}`);
    const emitSpy = jest.spyOn(component.imagensChange, 'emit');

    component.handleFiles(createFileList(1));

    expect(component.imagens.length).toBe(10);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('deve remover a imagem e emitir o novo array', () => {
    component.imagens = ['img-1', 'img-2', 'img-3'];
    const emitSpy = jest.spyOn(component.imagensChange, 'emit');

    component.removerImagem(1);

    expect(component.imagens).toEqual(['img-1', 'img-3']);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(['img-1', 'img-3']);
  });
});
