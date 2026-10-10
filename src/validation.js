// Клиентская проверка полей. Валидная форма передаётся событием form:valid.
// Никакие данные не отправляются и не сохраняются до интеграции с WordPress.
export function fieldMessage(field) {
  const value = field.value.trim();
  if (
    field.required &&
    (field.type === "checkbox"
      ? !field.checked
      : field.type === "radio"
        ? !field.form.querySelector(`input[name="${field.name}"]:checked`)
        : !value)
  ) {
    return field.type === "checkbox"
      ? "Подтвердите согласие с условиями."
      : field.type === "radio"
        ? "Выберите один из вариантов."
        : "Заполните это поле.";
  }
  if (!value || field.disabled) return "";
  const rule = field.dataset.rule;
  if (
    rule === "email" &&
    (!field.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  )
    return "Укажите корректный e-mail.";
  if (
    rule === "phone" &&
    (!/^[+\d\s()\-]+$/.test(value) ||
      value.replace(/\D/g, "").length < 10 ||
      value.replace(/\D/g, "").length > 15)
  )
    return "Укажите номер телефона: от 10 до 15 цифр.";
  if (
    rule === "name" &&
    (value.length < 2 || !/^[\p{L}\p{M}\s’'\-]+$/u.test(value))
  )
    return "Укажите имя буквами, не менее двух символов.";
  if (rule === "postcode" && !/^\d{6}$/.test(value))
    return "Индекс должен содержать 6 цифр.";
  if (rule === "newPassword" && field.value.length < 8)
    return "Пароль должен содержать не менее 8 символов.";
  if (
    rule === "passwordConfirm" &&
    field.value !== field.form.elements.password.value
  )
    return "Пароли не совпадают.";
  return field.validity.valid ? "" : "Проверьте значение поля.";
}

export function initValidation() {
  document
    .querySelectorAll("form[data-validate]")
    .forEach((form, formIndex) => {
      const fields = [
        ...form.querySelectorAll('input:not([type="submit"]), textarea'),
      ];
      const errors = new Map();
      let submitted = false;
      fields.forEach((field, index) => {
        let error;
        if (field.type === "radio") {
          error = errors.get(field.name);
          if (!error) {
            error = document.createElement("p");
            field.closest(".section__delivery").after(error);
            errors.set(field.name, error);
          }
        } else {
          error = document.createElement("p");
          if (field.type === "checkbox")
            field.closest(".action__checkbox").after(error);
          else {
            const wrapper = document.createElement("div");
            wrapper.className = "form__field";
            field.before(wrapper);
            wrapper.append(field, error);
          }
        }
        if (!error.id) {
          error.id = `form-${formIndex}-error-${index}`;
          error.className = "form__error";
        }
        field.setAttribute("aria-describedby", error.id);
        errors.set(field, error);
      });
      const validate = (field) => {
        const message = fieldMessage(field);
        errors.get(field).textContent = message;
        field.setAttribute("aria-invalid", String(Boolean(message)));
        return !message;
      };
      const updateDelivery = () => {
        if (form.id !== "checkout") return;
        const delivery = form.querySelector('[name="delivery"]:checked')?.value;
        form.elements.city.required = delivery !== "pickup";
        form.elements.address.required = delivery === "courier";
        form.elements.postcode.required = delivery === "courier";
      };
      fields.forEach((field) => {
        field.addEventListener("blur", () => validate(field));
        field.addEventListener("input", () => {
          if (submitted || field.getAttribute("aria-invalid") === "true")
            validate(field);
          if (field.name === "password" && form.elements.passwordConfirm?.value)
            validate(form.elements.passwordConfirm);
        });
        field.addEventListener("change", () => {
          updateDelivery();
          if (field.type === "radio")
            fields.filter((item) => item.name === field.name).forEach(validate);
          else if (submitted || field.type === "checkbox") validate(field);
          if (form.id === "checkout" && field.name === "delivery" && submitted)
            ["city", "address", "postcode"].forEach((name) =>
              validate(form.elements[name]),
            );
        });
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitted = true;
        updateDelivery();
        const invalid = fields.filter((field) => !validate(field));
        if (invalid.length) {
          invalid[0].focus();
          return;
        }
        form.dispatchEvent(new CustomEvent("form:valid", { bubbles: true }));
      });
      form.addEventListener("reset", () => {
        submitted = false;
        fields.forEach((field) => {
          errors.get(field).textContent = "";
          field.removeAttribute("aria-invalid");
        });
      });
      updateDelivery();
    });
}
