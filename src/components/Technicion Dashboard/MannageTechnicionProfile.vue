<template>
  <div v-if="isLoading" class="text-center text-gray-500 dark:text-white mt-20">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#133B5D] mx-auto mb-3"></div>
    {{ texts[lang]?.technicianDashboard?.profile?.loading || "Loading Profile..." }}
  </div>

  <section v-else class="space-y-6">
    <div class="flex justify-end" v-if="!isEditing">
      <button
        @click="isEditing = true"
        class="bg-[#133B5D] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#1b5383] transition duration-300 flex items-center justify-center gap-2 shadow-md"
      >
        <i class="fa-solid fa-pen-to-square"></i>
        {{ texts[lang]?.technicianDashboard?.profile?.editProfile || "Edit Profile" }}
      </button>
    </div>

    <div class="bg-white dark:bg-[#16222B] p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-5">
        {{ texts[lang]?.technicianDashboard?.profile?.personalInfo || "Personal Information" }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div class="md:col-span-2 flex flex-col items-center gap-3 mb-4">
          <div class="relative group">
            <img
              :src="tempTechnician.profileImage || '/images/Ellipse 56.png'"
              class="w-40 h-40 rounded-full object-cover border-4 border-[#133B5D] shadow-lg"
              :class="{ 'group-hover:opacity-70 cursor-pointer': isEditing }"
              @click="isEditing && triggerImageUpload"
              :alt="texts[lang]?.technicianDashboard?.profile?.profileImageAlt || 'Profile image'"
            />
            <div
              v-if="isEditing"
              class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              @click="triggerImageUpload"
            >
              <i class="fa-solid fa-camera text-white text-3xl"></i>
            </div>
            <input
              ref="imageInput"
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleImageUpload"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-user mr-2 text-[#133B5D] dark:text-white"></i>
            {{ texts[lang]?.technicianDashboard?.profile?.nameLabel || "Name" }}
          </label>
          <input
            v-model="tempTechnician.name"
            type="text"
            :disabled="!isEditing"
            :placeholder="texts[lang]?.technicianDashboard?.profile?.namePlaceholder || 'Enter your name'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-envelope mr-2 text-[#133B5D] dark:text-white"></i>
            {{ texts[lang]?.technicianDashboard?.profile?.emailLabel || "Email" }}
          </label>
          <input
            v-model="tempTechnician.email"
            type="email"
            :disabled="!isEditing"
            :placeholder="texts[lang]?.technicianDashboard?.profile?.emailPlaceholder || 'Email address'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 text-gray-500 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-phone mr-2 text-[#133B5D] dark:text-white"></i>
            {{ texts[lang]?.technicianDashboard?.profile?.phoneLabel || "Phone" }}
          </label>
          <input
            v-model="tempTechnician.phone"
            type="text"
            :disabled="!isEditing"
            :placeholder="texts[lang]?.technicianDashboard?.profile?.phonePlaceholder || 'Enter phone number'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-lock mr-2 text-[#133B5D] dark:text-white"></i>
            {{ texts[lang]?.technicianDashboard?.profile?.passwordLabel || "Password" }}
          </label>
          <input
            v-model="tempTechnician.password"
            type="text"
            :disabled="!isEditing"
            :placeholder="texts[lang]?.technicianDashboard?.profile?.passwordPlaceholder || 'Enter your password'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-lock mr-2 text-[#133B5D] dark:text-white"></i>
            {{ texts[lang]?.technicianDashboard?.profile?.confirmPasswordLabel || "Confirm Password" }}
          </label>
          <input
            v-model="tempTechnician.confirmPassword"
            type="text"
            :disabled="!isEditing"
            :placeholder="texts[lang]?.technicianDashboard?.profile?.confirmPasswordPlaceholder || 'Confirm your password'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-star mr-2 text-[#133B5D] dark:text-white"></i>
            {{ texts[lang]?.technicianDashboard?.profile?.experienceLabel || "Years of Experience" }}
          </label>
          <input
            v-model.number="tempTechnician.experience"
            type="number"
            min="0"
            :placeholder="texts[lang]?.technicianDashboard?.profile?.experiencePlaceholder || 'e.g., 5'"
            :disabled="!isEditing"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-book-open mr-2 text-[#133B5D] dark:text-white"></i>
            {{ texts[lang]?.technicianDashboard?.profile?.bioLabel || "Bio" }}
          </label>
          <textarea
            v-model="tempTechnician.bio"
            rows="4"
            :disabled="!isEditing"
            :placeholder="texts[lang]?.technicianDashboard?.profile?.bioPlaceholder || 'Tell clients a bit about yourself and your skills...'"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          ></textarea>
        </div>

      </div>
    </div>

    <div
      class="bg-white dark:bg-[#16222B] p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-6"
    >
      <div class="flex-1 space-y-4">
        <h3 class="text-xl font-semibold text-[#133B5D] dark:text-white">
          {{ texts[lang]?.technicianDashboard?.profile?.addressLabel || "Address" }}
        </h3>
        <div>
            <label class="block text-gray-700 dark:text-white font-medium mb-1">
              {{ texts[lang]?.technicianDashboard?.profile?.streetLabel || "Street" }}
            </label>
            <input
              v-model="tempTechnician.address.street"
              type="text"
              :disabled="!isEditing"
              :placeholder="texts[lang]?.technicianDashboard?.profile?.streetPlaceholder || 'Street name'"
              class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
            />
        </div>
        <div>
            <label class="block text-gray-700 dark:text-white font-medium mb-1">
              {{ texts[lang]?.technicianDashboard?.profile?.cityLabel || "City" }}
            </label>
            <input
              v-model="tempTechnician.address.city"
              type="text"
              :disabled="!isEditing"
              :placeholder="texts[lang]?.technicianDashboard?.profile?.cityPlaceholder || 'City'"
              class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
            />
        </div>
        <div>
            <label class="block text-gray-700 dark:text-white font-medium mb-1">
              {{ texts[lang]?.technicianDashboard?.profile?.countryLabel || "Country" }}
            </label>
            <input
              v-model="tempTechnician.address.country"
              type="text"
              :disabled="!isEditing"
              :placeholder="texts[lang]?.technicianDashboard?.profile?.countryPlaceholder || 'Country'"
              class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:disabled:bg-gray-800 dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
            />
        </div>
      </div>
      <div
        class="flex-1 h-64 w-full rounded-2xl overflow-hidden border border-gray-300 shadow-inner"
      >
        <iframe
          :src="mapSrc"
          width="100%"
          height="100%"
          style="border: 0"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    </div>

    <div v-if="isEditing" class="flex justify-center gap-4 mt-6">
      <button
        @click="saveChanges"
        :disabled="isSaving"
        class="cursor-pointer bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg disabled:opacity-50 flex items-center gap-2"
      >
        <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ isSaving ? (texts[lang]?.technicianDashboard?.saving || 'Saving...') : (texts[lang]?.technicianDashboard?.buttons?.saveChanges || 'Save Changes') }}
      </button>

      <button
        @click="cancelEdit"
        class="bg-red-500 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg"
      >
        <i class="fa-solid fa-xmark"></i>
        {{ texts[lang]?.technicianDashboard?.buttons?.cancel || 'Cancel' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged , updatePassword, updateEmail, } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadImageOnly } from "@/composables/useImageUpload";
import { useTestLang } from "@/langTest/useTestLang";

const { lang, texts } = useTestLang();

const emit = defineEmits(['showNotification']);

const isEditing = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);

const technicianId = ref(null);
const imageInput = ref(null);
const newImageFile = ref(null);

// ✅ Helper function to define the default structure
const defaultProfile = () => ({
  name: "",
  email: "",
  phone: "",
  experience: 0,
  bio: "",
  password:"",
  confirmPassword:"",
  profileImage: "",
  address: { street: "", city: "", country: "", lat: 30.0444, lng: 31.2357 }
});

// ✅ Initialize refs
const originalTechnician = ref(defaultProfile());
const tempTechnician = ref(defaultProfile());

let unsubscribe = null;

/**
 * SAFE helpers:
 * - getMsg(keysArray, fallback) returns texts[lang].a.b.c safely or fallback
 * - safeEmit(message, type) calls emit if available (wrapped to avoid runtime crash)
 */
const getMsg = (keys = [], fallback = "") => {
  try {
    // texts and lang come from useTestLang
    let cur = texts?.[lang];
    for (const k of keys) {
      if (!cur) return fallback;
      cur = cur[k];
    }
    return cur ?? fallback;
  } catch (e) {
    return fallback;
  }
};

const safeEmit = (message = "", level = "info") => {
  try {
    if (typeof emit === "function") emit("showNotification", message, level);
  } catch (e) {
    // if emit fails, at least log
    console.warn("emit failed:", e);
  }
};

// 1. Load data
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      technicianId.value = user.uid;
      await loadProfile();
    } else {
      console.log("No user logged in.");
      isLoading.value = false;
    }
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

// 2. Fetch data
const loadProfile = async () => {
  if (!technicianId.value) return;
  isLoading.value = true;
  try {
    const docRef = doc(db, "technicians", technicianId.value);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const fullProfile = {
        ...defaultProfile(),
        ...data,
        address: {
          ...defaultProfile().address,
          ...(data.address || {})
        }
      };
      originalTechnician.value = JSON.parse(JSON.stringify(fullProfile));
      tempTechnician.value = JSON.parse(JSON.stringify(fullProfile));
    } else {
      const msg = getMsg(['technicianDashboard','messages','couldNotLoadProfile'], 'Could not load profile data.');
      safeEmit(msg, 'error');
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    const msg = getMsg(['technicianDashboard','messages','errorLoadingProfile'], 'Error loading profile.');
    safeEmit(msg, 'error');
  }
  isLoading.value = false;
};

// 3. Save changes (without overwriting email)
const saveChanges = async () => {
  if (!technicianId.value) return;

  if (tempTechnician.value.password !== tempTechnician.value.confirmPassword) {
    const msg = getMsg(['technicianDashboard','messages','passwordsDoNotMatch'], 'Passwords do not match!');
    safeEmit(msg, 'error');
    return;
  }
  isSaving.value = true;
  const user = auth.currentUser;
  if (!user) {
    const msg = getMsg(['technicianDashboard','messages','noUserLoggedIn'], 'No user logged in.');
    safeEmit(msg, 'error');
    isSaving.value = false;
    return;
  }
  try {
    if (newImageFile.value) {
      const imageUrl = await uploadImageOnly(newImageFile.value);
      tempTechnician.value.profileImage = imageUrl;
    }

    const newPassword = tempTechnician.value.password;
    if (newPassword && newPassword.trim() !== "") {
      if (newPassword.length < 6) {
        const msg = getMsg(['technicianDashboard','messages','weakPassword'], 'Password must be at least 6 characters.');
        safeEmit(msg, 'error');
        isSaving.value = false;
        return;
      }
      await updatePassword(user, newPassword);
      console.log("Firebase Auth password updated.");
      tempTechnician.value.password = ""; // Clear from temp state
      tempTechnician.value.confirmPassword = ""; // Clear from temp state
    }

    // --- 3. Update Auth Email (if changed) ---
    const newEmail = tempTechnician.value.email;
    if (newEmail !== originalTechnician.value.email) {
      await updateEmail(user, newEmail);
      console.log("Firebase Auth email updated.");
    }

    // --- 4. Upload Image (if new one) ---
    if (newImageFile.value) {
      const imageUrl = await uploadImageOnly(newImageFile.value);
      tempTechnician.value.profileImage = imageUrl;
    }
    const docRef = doc(db, "technicians", technicianId.value);
    await updateDoc(docRef, {
      name: tempTechnician.value.name,
      email: tempTechnician.value.email,
      phone: tempTechnician.value.phone,
      experience: tempTechnician.value.experience,
      bio: tempTechnician.value.bio,
      profileImage: tempTechnician.value.profileImage,
      address: tempTechnician.value.address,
    });
    // 🔹 بعد updateDoc مباشرة
    window.dispatchEvent(new CustomEvent("profile-updated", {
      detail: { image: tempTechnician.value.profileImage }
    }));

    originalTechnician.value = JSON.parse(JSON.stringify(tempTechnician.value));
    const successMsg = getMsg(['technicianDashboard','messages','profileSaved'], 'Profile saved successfully!');
    safeEmit(successMsg, 'success');
    isEditing.value = false;
    newImageFile.value = null;
  } catch (error) {
    console.error("Error saving profile:", error);
    // restore UI values to original (you may prefer to NOT restore and keep changes)
    tempTechnician.value = JSON.parse(JSON.stringify(originalTechnician.value));
    
    if (error?.code === "auth/requires-recent-login") {
      const msg = getMsg(['technicianDashboard','messages','reauthRequired'], 'Please log out and log back in to change sensitive info.');
      safeEmit(msg, 'error');
    } else if (error?.code === "auth/weak-password") {
      const msg = getMsg(['technicianDashboard','messages','weakPassword'], 'Password is too weak (min 6 characters).');
      safeEmit(msg, 'error');
    } else if (error?.code === "auth/email-already-in-use") {
      const msg = getMsg(['technicianDashboard','messages','emailInUse'], 'Email is already in use by another account.');
      safeEmit(msg, 'error');
    } else {
      const msg = getMsg(['technicianDashboard','messages','failedToSaveProfile'], 'Failed to save profile.');
      safeEmit(msg, 'error');
    }
  }
  isSaving.value = false;
};

// 4. Cancel edit
const cancelEdit = () => {
  tempTechnician.value = JSON.parse(JSON.stringify(originalTechnician.value));
  newImageFile.value = null;
  isEditing.value = false;
};

// 5. Image upload
const triggerImageUpload = () => {
  if (imageInput?.value) imageInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  newImageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    tempTechnician.value.profileImage = e.target.result;
  };
  reader.readAsDataURL(file);
};

// 6. Computed Google Maps link
const mapSrc = computed(() => {
  const street = tempTechnician.value.address?.street || '';
  const city = tempTechnician.value.address?.city || '';
  const country = tempTechnician.value.address?.country || '';
  
  let query = `${street}, ${city}, ${country}`;
  if (!street && !city && !country) query = '30.0444,31.2357';
  
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=14&output=embed`;
});
</script>

<style scoped>
/* keep existing helpers */
</style>
