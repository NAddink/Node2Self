
import Swal from "sweetalert2";

export const SuccessMsg = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const ConfirmMsg = Swal.mixin({
    position: "center",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    cancelButtonColor: "Red",
    confirmButtonColor: "Green"
});