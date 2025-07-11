const axios = require("axios");
require("dotenv").config();

class SMSError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "SMSError";
    this.code = code || "UNKNOWN_ERROR";
  }
}

class SendSMS {
  #config = {
    apiUrl:
      process.env.MSEGAT_API_URL || "https://www.msegat.com/gw/sendsms.php",
    userName: process.env.MSEGAT_USERNAME || "HEBH",
    userSender: process.env.MSEGAT_SENDER || "lahn.sa",
    apiKey: process.env.MSEGAT_API_KEY || "fcff75f182c667a05d0a4251dbd8e2ab",
    timeout: parseInt(process.env.API_TIMEOUT) || 5000,
  };

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.#config.apiUrl,
      timeout: this.#config.timeout,
      headers: { "Content-Type": "application/json" },
    });
  }

  #validatePhoneNumber(phone) {
    if (!phone || typeof phone !== "string") {
      throw new SMSError("Invalid phone number", "INVALID_PHONE");
    }
    return phone.trim();
  }

  #validateMessage(msg) {
    if (!msg || typeof msg !== "string" || msg.length > 160) {
      throw new SMSError(
        "Invalid message: must be non-empty string and less than 160 characters",
        "INVALID_MESSAGE"
      );
    }
    return msg;
  }

  formatNumber(str) {
    try {
      let s = this.#validatePhoneNumber(str);
      const prefixes = {
        "0966": "966",
        "00966": "966",
        "+966": "966",
        "05": "9665",
        5: "9665",
      };

      for (const [prefix, replacement] of Object.entries(prefixes)) {
        if (s.startsWith(prefix)) {
          s = s.replace(prefix, replacement);
          break;
        }
      }

      return s;
    } catch (error) {
      console.error(`Error formatting number: ${error.message}`);
      throw error;
    }
  }

  isSaudiNumber(str) {
    try {
      if (!str) return false;
      const formatted = this.formatNumber(str);
      return formatted.length === 12 && formatted.startsWith("9665");
    } catch (error) {
      console.error(`Error validating Saudi number: ${error.message}`);
      return false;
    }
  }

  async sendToList(numbers, msg) {
    try {
      if (!Array.isArray(numbers) || numbers.length === 0) {
        throw new SMSError(
          "Numbers must be a non-empty array",
          "INVALID_NUMBERS"
        );
      }

      this.#validateMessage(msg);
      const validNumbers = numbers
        .map((num) => this.formatNumber(num))
        .filter((num) => this.isSaudiNumber(num));

      if (validNumbers.length === 0) {
        throw new SMSError(
          "No valid Saudi numbers provided",
          "NO_VALID_NUMBERS"
        );
      }

      const payload = {
        userName: this.#config.userName,
        userSender: this.#config.userSender,
        apiKey: this.#config.apiKey,
        numbers: validNumbers.join(","),
        msg,
      };

      console.log("Sending SMS to multiple numbers:", {
        numbers: validNumbers,
        msg,
      });
      const response = await this.httpClient.post("", payload);

      return {
        isSuccess: true,
        data: response.data,
        status: response.status,
        numbers: validNumbers,
      };
    } catch (error) {
      console.error("Failed to send SMS to list:", {
        error: error.message,
        code: error.code || "API_ERROR",
      });
      return {
        isSuccess: false,
        error: error.message,
        code: error.code || "API_ERROR",
      };
    }
  }

  async sendSMSMessage(msg, phone) {
    try {
      const formattedPhone = this.formatNumber(
        this.#validatePhoneNumber(phone)
      );
      if (!this.isSaudiNumber(formattedPhone)) {
        throw new SMSError("Invalid Saudi phone number", "INVALID_SA_NUMBER");
      }

      this.#validateMessage(msg);
      const payload = {
        userName: this.#config.userName,
        userSender: this.#config.userSender,
        apiKey: this.#config.apiKey,
        numbers: formattedPhone,
        msg,
      };

      console.log("Sending SMS to single number:", {
        number: formattedPhone,
        msg,
      });
      const response = await this.httpClient.post("", payload);

      return {
        isSuccess: true,
        data: response.data,
        status: response.status,
        number: formattedPhone,
      };
    } catch (error) {
      console.error("Failed to send single SMS:", {
        error: error.message,
        code: error.code || "API_ERROR",
      });
      return {
        isSuccess: false,
        error: error.message,
        code: error.code || "API_ERROR",
      };
    }
  }

  getSendState(data) {
    try {
      if (!data || typeof data !== "string") return 0;

      const cleanedData = data.replace(/["{}]/g, "");
      const parts = cleanedData.split(",");
      for (const item of parts) {
        if (item.includes("code")) {
          const [, code] = item.split(":");
          return parseInt(code) || 0;
        }
      }
      return 0;
    } catch (error) {
      console.error("Error parsing send state:", error.message);
      return 0;
    }
  }
}

module.exports = SendSMS;
