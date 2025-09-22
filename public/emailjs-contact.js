// EmailJS Contact Form Handler
// Usar EmailJS desde CDN global
const emailJSService = window.emailjs;

// EmailJS Configuration
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "AYU-PV5RC_n-gGyOl",
  SERVICE_ID: "service_2ju2hnv",
  TEMPLATE_ID: "template_po63045",
  AUTO_REPLY_TEMPLATE_ID: "template_jdo9ssf",
};

// Initialize EmailJS
emailJSService.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Location and Service name mappings (same as before)
const serviceNames = {
  "facade-cleaning": "High-Rise Facade Cleaning",
  "window-washing": "High-Rise Window Washing",
  "roof-washing": "Roof Washing",
  "solar-panel-cleaning": "Solar Panel Cleaning",
  "gutter-cleaning": "Gutter Cleaning",
  "pressure-washing": "Pressure Washing",
  "exterior-surface-cleaning": "Exterior Surface Cleaning",
  "commercial-building-maintenance": "Commercial Building Maintenance",
  "industrial-equipment-cleaning": "Industrial Equipment Cleaning",
  "multiple-services": "Multiple Services",
  consultation: "Free Consultation",
};

const locationNames = {
  brevard: "Brevard",
  citrus: "Citrus",
  hernando: "Hernando",
  hillsborough: "Hillsborough",
  "indian-river": "Indian River",
  lake: "Lake",
  marion: "Marion",
  orange: "Orange",
  osceola: "Osceola",
  pasco: "Pasco",
  pinellas: "Pinellas",
  polk: "Polk",
  seminole: "Seminole",
  sumter: "Sumter",
  volusia: "Volusia",
  other: "Other",
};

// Professional notification system
function createNotification(message, type) {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = `
    notification-toast
    max-w-sm w-full
    bg-white border-l-4 rounded-lg shadow-xl
    transform transition-all duration-500 ease-in-out
    translate-x-full opacity-0
    p-4 relative
    ${
      type === "success"
        ? "border-green-500"
        : type === "error"
        ? "border-red-500"
        : "border-blue-500"
    }
  `;

  const iconColor =
    type === "success"
      ? "text-green-500"
      : type === "error"
      ? "text-red-500"
      : "text-blue-500";
  const bgColor =
    type === "success"
      ? "bg-green-50"
      : type === "error"
      ? "bg-red-50"
      : "bg-blue-50";

  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 rounded-full ${bgColor} flex items-center justify-center">
          ${
            type === "success"
              ? `
            <svg class="w-5 h-5 ${iconColor}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          `
              : type === "error"
              ? `
            <svg class="w-5 h-5 ${iconColor}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          `
              : `
            <svg class="w-5 h-5 ${iconColor}" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          `
          }
        </div>
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium text-gray-900 leading-relaxed">
          ${message}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0">
        <button 
          class="close-btn inline-flex text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
          onclick="window.closeNotification(this)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  container.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full", "opacity-0");
    notification.classList.add("translate-x-0", "opacity-100");
  }, 100);

  // Auto close after 5 seconds
  setTimeout(() => {
    window.closeNotification(notification.querySelector(".close-btn"));
  }, 5000);
}

// Global function to close notifications
window.closeNotification = function (button) {
  if (!button) return;
  const notification = button.closest(".notification-toast");
  if (notification) {
    notification.classList.add("translate-x-full", "opacity-0");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
};

// Form validation
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    message: "Name must be at least 2 characters long",
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  location: {
    required: true,
    message: "Please select your county",
  },
  customLocation: {
    required: false,
    minLength: 2,
    message: "Please specify your county (at least 2 characters)",
  },
  service: {
    required: true,
    message: "Please select a service",
  },
};

function validateField(field) {
  const rule = validationRules[field.name];
  if (!rule) return true;

  const errorElement = field.parentElement?.querySelector("span.error-message");
  if (!errorElement) {
    console.warn(`Error element not found for field: ${field.name}`);
    return true;
  }

  let isValid = true;
  let message = "";

  // Special handling for customLocation field
  if (field.name === "customLocation") {
    const locationSelect = document.querySelector('select[name="location"]');
    const isOtherSelected = locationSelect && locationSelect.value === "Other";

    if (!isOtherSelected) {
      isValid = true;
    } else if (!field.value.trim()) {
      isValid = false;
      message = rule.message;
    } else if (rule.minLength && field.value.trim().length < rule.minLength) {
      isValid = false;
      message = rule.message;
    }
  } else {
    // Standard validation
    if (rule.required && !field.value.trim()) {
      isValid = false;
      message = rule.message;
    } else if (rule.minLength && field.value.trim().length < rule.minLength) {
      isValid = false;
      message = rule.message;
    } else if (rule.pattern && !rule.pattern.test(field.value)) {
      isValid = false;
      message = rule.message;
    }
  }

  // Update UI
  if (isValid) {
    field.classList.remove("border-red-500");
    field.classList.add("border-green-500");
    errorElement.textContent = "";
  } else {
    field.classList.remove("border-green-500");
    field.classList.add("border-red-500");
    errorElement.textContent = message;
  }

  return isValid;
}

// Send email via EmailJS
async function sendEmail(formData) {
  // Validate email address first
  if (!formData.email || !formData.email.trim()) {
    return { success: false, error: "Email address is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { success: false, error: "Please provide a valid email address" };
  }

  console.log("Sending email with form data:", formData); // Debug log

  // Prepare template parameters
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    subject: `New Contact Form Submission - ${
      serviceNames[formData.service] || formData.service
    }`,
    service: serviceNames[formData.service] || formData.service,
    location:
      formData.location === "Other" && formData.customLocation
        ? formData.customLocation
        : locationNames[formData.location] || formData.location,
    submitted_at: new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }),
  };

  try {
    // Send main email
    const emailResponse = await emailJSService.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    // Send auto-reply if template ID is configured
    if (EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE_ID) {
      const autoReplyParams = {
        // Intentar múltiples campos que EmailJS puede reconocer
        to_email: formData.email,
        user_email: formData.email,
        reply_to: formData.email,
        email: formData.email,

        to_name: formData.name,
        user_name: formData.name,
        name: formData.name,

        service: serviceNames[formData.service] || formData.service,
        location: templateParams.location,
        submitted_date: new Date().toLocaleDateString("en-US"),
      };

      const autoReplyResponse = await emailJSService.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE_ID,
        autoReplyParams
      );
    }

    return { success: true, data: emailResponse };
  } catch (error) {
    console.error("EmailJS Error Details:", error);

    let errorMessage = "Failed to send email";

    if (error.status === 422) {
      errorMessage =
        "There was a validation error. Please check that all fields are filled correctly.";
    } else if (error.status === 400) {
      errorMessage =
        "Bad request. Please check your email address and try again.";
    } else if (
      error.text &&
      error.text.includes("recipients address is empty")
    ) {
      errorMessage =
        "Email address validation failed. Please check your email address.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
}

// Initialize form functionality
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const formFields = form.querySelectorAll("input, select, textarea");
  const locationSelect = form.querySelector('select[name="location"]');
  const customLocationField = document.getElementById("custom-location-field");
  const customLocationInput = document.getElementById("custom-location");

  // Toggle custom location field
  function toggleCustomLocation() {
    if (!locationSelect || !customLocationField) return;

    if (locationSelect.value === "Other") {
      customLocationField.style.display = "block";
      customLocationInput.setAttribute("required", "true");
    } else {
      customLocationField.style.display = "none";
      customLocationInput.removeAttribute("required");
      customLocationInput.value = "";
      if (customLocationInput) {
        customLocationInput.classList.remove(
          "border-red-500",
          "border-green-500"
        );
        const errorElement =
          customLocationInput.parentElement?.querySelector(
            "span.error-message"
          );
        if (errorElement) errorElement.textContent = "";
      }
    }
  }

  // Add event listeners
  formFields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("border-red-500")) {
        validateField(field);
      }
    });
  });

  if (locationSelect) {
    locationSelect.addEventListener("change", toggleCustomLocation);
  }

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    formFields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    // Special validation for customLocation when "Other" is selected
    if (locationSelect?.value === "Other" && customLocationInput) {
      if (!validateField(customLocationInput)) {
        isFormValid = false;
      }
    }

    if (!isFormValid) {
      createNotification("Please fix the errors above.", "error");
      return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector(".submit-text");
    const loadingText = submitButton.querySelector(".loading-text");

    submitButton.disabled = true;
    submitText.classList.add("hidden");
    loadingText.classList.remove("hidden");

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Send email via EmailJS
      const result = await sendEmail(data);

      if (result.success) {
        createNotification(
          "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours. Please check your email for a confirmation.",
          "success"
        );
        form.reset();

        // Reset field styles and hide custom location field
        formFields.forEach((field) => {
          field.classList.remove("border-green-500", "border-red-500");
        });

        if (customLocationField) {
          customLocationField.style.display = "none";
        }
      } else {
        createNotification(
          `Sorry, there was an error sending your message: ${result.error}. Please try again or contact us directly.`,
          "error"
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      createNotification(
        "Sorry, there was a network error. Please check your connection and try again, or contact us directly.",
        "error"
      );
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitText.classList.remove("hidden");
      loadingText.classList.add("hidden");
    }
  });
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initContactForm);
