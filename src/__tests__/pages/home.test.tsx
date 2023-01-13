import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { Home } from "../../pages/home";
import "@testing-library/jest-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Home", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({
      data: "shortened url",
    });
  });

  afterEach(() => {
    mockedAxios.post.mockRestore();
  });

  it("should render the input field and submit button", () => {
    // Render the component
    const { getByPlaceholderText, getByText } = render(<Home />);

    // Get the input element and button
    const input = getByPlaceholderText("Please type the link");
    const button = getByText("Gerar Link");

    // Assert that they are rendered
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should call the submit handler and show the shortened URL when the button is clicked", async () => {
    // Render the component
    const { rerender, getByPlaceholderText, getByText } = render(<Home />);

    // Get the input element and button
    const input = getByPlaceholderText("Please type the link");
    const button = getByText("Gerar Link");

    // Type a URL into the input field
    fireEvent.change(input, { target: { value: "https://example.com" } });

    // Click the submit button
    fireEvent.click(button);

    // Wait for the axios call to complete
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());

    rerender(<Home />);

    // Get the shortened URL element
    const shortenedUrl = getByPlaceholderText("shortened url");

    // Assert that it is shown on the page
    expect(shortenedUrl).toBeInTheDocument();
    expect((shortenedUrl as HTMLInputElement).value).toEqual("shortened url");
  });

  it("should show an error message when the input is invalid", async () => {
    // Render the component
    const { getByPlaceholderText, getByText } = render(<Home />);

    // Get the input element and button
    const input = getByPlaceholderText("Please type the link");
    const button = getByText("Gerar Link");

    // Type an invalid URL into the input field
    fireEvent.change(input, { target: { value: "a" } });

    // Click the submit button
    fireEvent.click(button);

    // Wait for the axios call to complete
    await waitFor(() => expect(mockedAxios.post).not.toHaveBeenCalled());

    // Get the error message
    const error = getByText("Invalid URL!");

    // Assert that it is shown on the page
    expect(error).toBeInTheDocument();
  });
});
