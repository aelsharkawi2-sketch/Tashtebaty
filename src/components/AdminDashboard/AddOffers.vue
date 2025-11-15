<template>
  <div class="p-6 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 min-h-screen">

    <h1 class="text-3xl font-bold text-[#133B5D] dark:text-[#8db4ff] mb-6">
      {{ texts[lang].adminDashboard.offers.title }}
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- ADD NEW OFFER -->
      <div class="lg:col-span-1">
        <div
          class="bg-white dark:bg-[#1f2937] dark:text-gray-100 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {{ texts[lang].adminDashboard.offers.addNewOffer }}
          </h2>

          <form @submit.prevent="addOffer" class="space-y-4">

            <div>
              <label class="block font-medium mb-1">
                {{ texts[lang].adminDashboard.offers.titleLabel }}
              </label>
              <input
                v-model="newOffer.title"
                type="text"
                required
                placeholder="e.g., 20% OFF"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <div>
              <label class="block font-medium mb-1">
                {{ texts[lang].adminDashboard.offers.descriptionLabel }}
              </label>
              <input
                v-model="newOffer.description"
                type="text"
                required
                placeholder="e.g., On all plumbing services"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <div>
              <label class="block font-medium mb-1">
                {{ texts[lang].adminDashboard.offers.uploadImage }}
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <button
              type="submit"
              :disabled="isSaving"
              class="w-full bg-accent-color text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#1b5383] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg
                v-if="isSaving"
                class="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291
                   A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3
                   7.938l3-2.647z"
                ></path>
              </svg>

              {{
                isSaving
                  ? texts[lang].adminDashboard.offers.saving
                  : texts[lang].adminDashboard.offers.addOffer
              }}
            </button>
          </form>
        </div>
      </div>

      <!-- EXISTING OFFERS -->
      <div class="lg:col-span-2">
        <div
          class="bg-white dark:bg-[#1f2937] dark:text-gray-100 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-xl font-semibold mb-4">
            {{ texts[lang].adminDashboard.offers.currentOffers }}
          </h2>

          <!-- Loading -->
          <div v-if="isLoading" class="text-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#133B5D] mx-auto mb-3"></div>
            {{ texts[lang].adminDashboard.offers.loading }}
          </div>

          <!-- Empty -->
          <div v-else-if="offers.length === 0" class="text-center py-10 text-gray-500">
            <i class="fa-solid fa-tags text-3xl mb-3"></i>
            <p>{{ texts[lang].adminDashboard.offers.noOffers }}</p>
          </div>

          <!-- Offers List -->
          <div v-else class="space-y-4">
            <div
              v-for="offer in offers"
              :key="offer.id"
              class="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="offer.image"
                  class="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 class="font-semibold">{{ offer.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ offer.description }}
                  </p>
                </div>
              </div>

              <button
                @click="deleteOffer(offer.id)"
                class="text-red-500 hover:text-red-700 transition"
                :title="texts[lang].adminDashboard.offers.delete"
              >
                <i class="fa-solid fa-trash-can text-lg"></i>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { uploadImageOnly } from "@/composables/useImageUpload";

// 🔥 اللغة الجديدة
import { useTestLang } from "@/langTest/useTestLang";
const { lang, texts } = useTestLang();

const offers = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const selectedFile = ref(null);

const newOffer = ref({
  title: "",
  description: "",
  image: "",
});

const offersCollection = collection(db, "offers");

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const fetchOffers = async () => {
  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(offersCollection);
    offers.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching offers:", error);
  } finally {
    isLoading.value = false;
  }
};

const addOffer = async () => {
  if (!newOffer.value.title || !newOffer.value.description || !selectedFile.value) {
    alert(texts[lang].adminDashboard.offers.fillAllFields);
    return;
  }

  isSaving.value = true;

  try {
    newOffer.value.image = await uploadImageOnly(selectedFile.value);

    await addDoc(offersCollection, {
      title: newOffer.value.title,
      description: newOffer.value.description,
      image: newOffer.value.image,
    });

    newOffer.value = { title: "", description: "", image: "" };
    selectedFile.value = null;

    await fetchOffers();
  } catch (error) {
    console.error("Error adding offer:", error);
  } finally {
    isSaving.value = false;
  }
};

const deleteOffer = async (id) => {
  if (!confirm(texts[lang].adminDashboard.offers.deleteConfirm)) return;

  try {
    await deleteDoc(doc(db, "offers", id));
    await fetchOffers();
  } catch (error) {
    console.error("Error deleting offer:", error);
  }
};

onMounted(fetchOffers);
</script>

<style scoped>
/* نفس الـ CSS بدون تغيير */
</style>
