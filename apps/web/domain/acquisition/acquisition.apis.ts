import type { SourceAndUseRequest, SourceAndUseResponse } from "./acquisition.types"

const API_BASE_URL = "http://localhost:8080/api/v1"

export async function fetchSourceAndUse(
  request: SourceAndUseRequest
): Promise<SourceAndUseResponse> {
  const response = await fetch(`${API_BASE_URL}/acquisition/source-and-use`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch source and use")
  }

  return response.json()
}
