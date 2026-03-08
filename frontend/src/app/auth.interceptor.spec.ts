import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { credentialsInterceptor } from './auth.interceptor';

describe('credentialsInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([credentialsInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set withCredentials to true on GET requests', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should set withCredentials to true on POST requests', () => {
    httpClient.post('/test', { data: 1 }).subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });
});
