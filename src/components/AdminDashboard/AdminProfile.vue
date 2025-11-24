<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6">
    <div class="max-w-2xl mx-auto bg-white dark:bg-[#1f2937] shadow-md rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold text-[#5984C6] dark:text-[#8db4ff]">{{ texts.adminDashboard?.adminProfile?.title || 'Admin Profile' }}</h2>
        
        <!-- Language Switch -->
        <button
          ref="langButton"
          @click="toggleLanguage"
          class="group relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200 language-switch-button"
          :title="texts[lang]?.adminDashboard?.sidebar?.switchToEnglish || 'Switch language'"
        >
          <i
            ref="langIcon"
            class="fa-solid fa-language absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 transition-all duration-500 dark:text-gray-100 group-hover:text-[#5984C6] dark:group-hover:text-white"
          ></i>
          <span class="sr-only">Toggle language</span>
        </button>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8 text-gray-600 dark:text-gray-300">{{ texts.adminDashboard?.adminProfile?.loading || 'Loading...' }}</div>
      
      <!-- Content -->
      <div v-else>
        <!-- Profile Picture Section -->
        <div class="flex flex-col items-center mb-6 relative">
          <div
            @click="triggerFileInput"
            class="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition relative"
          >
            <img
              v-if="photoURL && photoURL !== 'null' && !photoURL.startsWith('undefined')"
              :src="photoURL"
              alt="Profile"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <i v-else class="fa-solid fa-user text-4xl text-gray-500"></i>
          </div>
          
          <!-- Delete Image Button -->
          <button
            v-if="photoURL && photoURL !== 'null' && !photoURL.startsWith('undefined')"
            @click="deleteProfileImage"
            class="absolute top-20 right-1/2 transform translate-x-12 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
            :title="texts.adminDashboard?.adminProfile?.removeProfilePicture || 'Remove profile picture'"
          >
            <i class="fa-solid fa-xmark text-[10px]"></i>
          </button>
        </div>

        <!-- Upload Instructions -->
        <p class="text-sm text-gray-500 dark:text-gray-300 mt-2 text-center">
          {{ photoURL ? (texts.adminDashboard?.adminProfile?.clickToChange || 'Click to change profile picture') : (texts.adminDashboard?.adminProfile?.clickToAdd || 'Click to add profile picture') }}
        </p>
   
        <!-- Hidden Input for image -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="onFileChange"
          class="hidden"
        />

        <!-- Profile Info -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 dark:text-gray-200 mb-1">{{ texts.adminDashboard?.adminProfile?.name || 'Name' }}</label>
            <input
              v-model="name"
              type="text"
              class="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block text-gray-700 dark:text-gray-200 mb-1">{{ texts.adminDashboard?.adminProfile?.email || 'Email' }}</label>
            <input
              v-model="email"
              type="email"
              disabled
              class="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 cursor-not-allowed"
            />
          </div>

          <button
            @click="updateProfile"
            :disabled="saving"
            class="w-full bg-[#5984C6] text-white py-2 rounded-lg hover:bg-[#4a6ea8] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? (texts.adminDashboard?.adminProfile?.saving || 'Saving...') : (texts.adminDashboard?.adminProfile?.saveChanges || 'Save Changes') }}
          </button>
        </div>

        <div class="mt-3">
          <p v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { auth, db } from "../../firebase/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { updateProfile, reload } from "firebase/auth";
import { useTestLang } from "@/langTest/useTestLang";

export default {
  name: "AdminProfile",
  setup() {
    const { lang, texts: allTexts, switchLang } = useTestLang();
    const texts = computed(() => allTexts[lang.value] || {});
    const langButton = ref(null);
    const langIcon = ref(null);
    const isLanguageSwitching = ref(false);

    const name = ref("");
    const email = ref("");
    const photoURL = ref(null);
    const photoPublicId = ref(null);
    const file = ref(null);
    const loading = ref(true);
    const saving = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");
    const fileInput = ref(null);

    // Load user data
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        loading.value = false;
        return;
      }

      await reload(user);

      email.value = user.email;
      name.value = user.displayName || "Admin";

      const docRef = doc(db, "admin", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        name.value = data.name || name.value;

        if (data.photoURL && data.photoURL !== "null" && !data.photoURL.startsWith("undefined")) {
          photoURL.value = data.photoURL;
        } else {
          photoURL.value = null;
        }

        if (data.photoPublicId) {
          photoPublicId.value = data.photoPublicId;
        }
      } else {
        if (user.photoURL && user.photoURL !== "null" && !user.photoURL.startsWith("undefined")) {
          photoURL.value = user.photoURL;
        } else {
          photoURL.value = null;
        }
      }
      loading.value = false;
    };

    const triggerFileInput = () => {
      if (fileInput.value) fileInput.value.click();
    };

    const handleImageError = (event) => {
      photoURL.value = null;
      event.target.style.display = "none";
    };

    const onFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        errorMessage.value =
          texts.value.adminDashboard?.adminProfile?.noFileSelected ||
          "No file selected";
        return;
      }

      if (!selectedFile.type.startsWith("image/")) {
        errorMessage.value =
          texts.value.adminDashboard?.adminProfile?.selectValidImage ||
          "Please select a valid image file";
        if (fileInput.value) fileInput.value.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        errorMessage.value =
          texts.value.adminDashboard?.adminProfile?.imageSizeError ||
          "Image size should be less than 5MB";
        if (fileInput.value) fileInput.value.value = "";
        return;
      }

      try {
        file.value = selectedFile;
        photoURL.value = URL.createObjectURL(selectedFile);
        errorMessage.value = "";
        successMessage.value =
          texts.value.adminDashboard?.adminProfile?.imageSelected ||
          "Image selected successfully";
      } catch (error) {
        console.error("Error handling file:", error);
        errorMessage.value = "Error processing image. Please try again.";
        file.value = null;
        photoURL.value = null;
        if (fileInput.value) fileInput.value.value = "";
      }
    };

    const clearImageCaches = async () => {
      if (photoURL.value) {
        const timestamp = Date.now();
        await updateProfile(auth.currentUser, {
          photoURL: `null?t=${timestamp}`,
        });

        localStorage.removeItem("adminPhoto");
        sessionStorage.removeItem("adminPhoto");

        if (photoURL.value.startsWith("blob:")) {
          URL.revokeObjectURL(photoURL.value);
        }

        const img = document.querySelector('img[alt="Profile"]');
        if (img) {
          img.src = "";
        }
      }

      if (fileInput.value) {
        fileInput.value.value = "";
      }

      photoURL.value = null;
      file.value = null;
    };

    const deleteProfileImage = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          errorMessage.value =
            texts.value.adminDashboard?.adminProfile?.loginFirst ||
            "Please log in first";
          return;
        }

        saving.value = true;
        errorMessage.value = "";
        successMessage.value = "";

        const timestamp = Date.now();

        if (photoPublicId.value) {
          try {
            const { deleteImage } = await import(
              "../../composables/useImageUpload"
            );
            await deleteImage(photoPublicId.value);
          } catch (deleteError) {
            console.error("Error deleting from Cloudinary:", deleteError);
          }
        }

        photoURL.value = null;
        photoPublicId.value = null;
        file.value = null;

        localStorage.removeItem("adminPhoto");
        sessionStorage.removeItem("adminPhoto");

        window.dispatchEvent(
          new CustomEvent("adminProfileChanged", {
            detail: {
              name: name.value,
              photoURL: null,
              timestamp,
              forceUpdate: true,
            },
          })
        );

        document.querySelectorAll('img[alt="Profile"]').forEach((img) => {
          if (img.src.startsWith("blob:")) {
            URL.revokeObjectURL(img.src);
          }
          img.src = "";
          img.style.display = "none";
        });

        if (fileInput.value) {
          fileInput.value.value = "";
        }

        await updateProfile(user, {
          photoURL: null,
        });

        const refDoc = doc(db, "admin", user.uid);
        await setDoc(
          refDoc,
          {
            photoURL: null,
            photoPublicId: null,
            lastImageUpdate: timestamp,
          },
          { merge: true }
        );

        await reload(user);

        window.dispatchEvent(
          new CustomEvent("adminProfileChanged", {
            detail: {
              name: name.value,
              photoURL: null,
              timestamp: Date.now(),
              forceUpdate: true,
            },
          })
        );

        successMessage.value =
          texts.value.adminDashboard?.adminProfile?.success ||
          "Profile picture removed successfully";
      } catch (error) {
        console.error("Error removing profile picture:", error);
        errorMessage.value =
          texts.value.adminDashboard?.adminProfile?.error ||
          "Error removing profile picture";

        try {
          const storedPhoto = localStorage.getItem("adminPhoto");
          if (storedPhoto) {
            photoURL.value = storedPhoto;
            window.dispatchEvent(
              new CustomEvent("adminProfileChanged", {
                detail: {
                  name: name.value,
                  photoURL: storedPhoto,
                  timestamp: Date.now(),
                  forceUpdate: true,
                },
              })
            );
          }
        } catch (e) {
          console.error("Failed to revert changes:", e);
        }
      } finally {
        saving.value = false;
      }
    };

    const toggleLanguage = () => {
      isLanguageSwitching.value = true;

      const next = lang.value === "ar" ? "en" : "ar";
      const isClockwise = next === "ar"; // Clockwise for English to Arabic

      // Add rotation class to icon
      if (langIcon.value) {
        langIcon.value.classList.add(
          isClockwise ? "rotate-animate-clockwise" : "rotate-animate-counterclockwise"
        );
      }

      switchLang(next);

      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";

      localStorage.setItem("lang", next);

      // Remove rotation class after animation
      setTimeout(() => {
        isLanguageSwitching.value = false;
        if (langIcon.value) {
          langIcon.value.classList.remove(
            "rotate-animate-clockwise",
            "rotate-animate-counterclockwise"
          );
        }
      }, 600);
    };

    const updateProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          errorMessage.value = texts.value.adminDashboard?.adminProfile?.loginFirst || 'Please log in first';
          return;
        }

        saving.value = true;
        errorMessage.value = "";
        successMessage.value = "";

        let newPhotoURL = photoURL.value;
        let newPhotoPublicId = photoPublicId.value;

        if (file.value) {
          try {
            const { uploadImageOnly } = await import("../../composables/useImageUpload");
            const uploadResult = await uploadImageOnly(file.value);

            if (uploadResult && uploadResult.url) {
              newPhotoURL = uploadResult.url;
              newPhotoPublicId = uploadResult.publicId || null;
            } else {
              throw new Error("Invalid upload result");
            }
          } catch (uploadError) {
            console.error("Error uploading to Cloudinary:", uploadError);
            errorMessage.value = `Upload failed: ${uploadError.message || 'Unknown error'}`;
            saving.value = false;
            return;
          }
        }

        await updateProfile(user, {
          displayName: name.value,
          photoURL: newPhotoURL,
        });

        const refDoc = doc(db, "admin", user.uid);
        await setDoc(refDoc, {
          name: name.value,
          photoURL: newPhotoURL,
          photoPublicId: newPhotoPublicId
        }, { merge: true });

        photoURL.value = newPhotoURL;
        photoPublicId.value = newPhotoPublicId;
        localStorage.setItem("adminPhoto", newPhotoURL);
        localStorage.setItem("adminName", name.value);

        const event = new CustomEvent("adminProfileChanged", {
          detail: { name: name.value, photoURL: newPhotoURL },
        });
        window.dispatchEvent(event);

        successMessage.value = texts.value.adminDashboard?.adminProfile?.changesSaved || 'Changes saved successfully';

        if (fileInput.value) {
          fileInput.value.value = '';
        }
        file.value = null;

      } catch (err) {
        console.error("Error updating profile:", err);
        errorMessage.value = texts.value.adminDashboard?.adminProfile?.saveError || 'Error saving changes';
      } finally {
        saving.value = false;
        setTimeout(() => {
          successMessage.value = "";
          errorMessage.value = "";
        }, 3000);
      }
    };

    onMounted(() => {
      loadUserData();

      try {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const hasClass = document.documentElement.classList.contains('dark');
        const target = saved ? saved : (prefersDark ? 'dark' : 'light');

        if ((hasClass && target === 'dark') || (!hasClass && target === 'light')) {
          // do nothing
        } else {
          if (target === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (e) {
        console.error("Error setting theme:", e);
      }
    });

    return {
      lang,
      texts,
      langButton,
      langIcon,
      isLanguageSwitching,
      name,
      email,
      photoURL,
      photoPublicId,
      file,
      loading,
      saving,
      successMessage,
      errorMessage,
      fileInput,
      triggerFileInput,
      handleImageError,
      onFileChange,
      clearImageCaches,
      deleteProfileImage,
      updateProfile,
      toggleLanguage,
    };
  }
};
</script>

<style scoped>
.rotate-animate-clockwise {
  animation: rotateClockwise 0.5s ease-in-out;
}

.rotate-animate-counterclockwise {
  animation: rotateCounterclockwise 0.5s ease-in-out;
}

@keyframes rotateClockwise {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes rotateCounterclockwise {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(-360deg); }
}

input[type="file"] {
  border: none;
}
</style>