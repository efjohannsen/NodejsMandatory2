function loginInput() {
    const formData = document.getElementById("form-login");
    const form = new FormData(formData);

    const t = form.get("form-login");
    console.log(t);
}