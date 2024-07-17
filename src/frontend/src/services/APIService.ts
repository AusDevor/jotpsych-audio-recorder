class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private appVersion: string;

  private constructor() {
    this.baseUrl = "http://localhost:3002";
    this.appVersion = "1.2.0";
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public async request(
    endpoint: string,
    method: string,
    body?: any,
    auth: boolean = false
  ): Promise<any> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "app-version": this.appVersion,
    };

    if (auth) {
      // get access token somehow
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  }

  public async login(username: string, password: string): Promise<any> {
    const body = { username, password };
    return this.request("/login", "POST", body);
  }

  public async register(username: string, password: string): Promise<any> {
    const body = { username, password };
    return this.request("/register", "POST", body);
  }

  public async fetchUser(): Promise<any> {
    return this.request("/user", "GET", null, true);
  }

  public async uploadAudio(audioBlob: Blob): Promise<any> {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    return this.request("/upload", "POST", formData, true);
  }
}

export default APIService.getInstance();
