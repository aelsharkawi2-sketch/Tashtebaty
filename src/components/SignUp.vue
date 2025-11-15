<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-10"
  >
    <h1 class="text-4xl font-bold text-accent-color mb-2">
      {{ texts[lang].signUp.title }}
    </h1>

    <p class="text-gray-600 mb-8 text-lg">
      {{ texts[lang].signUp.subtitle }}
    </p>

    <!-- Tabs -->
    <div
      class="flex rounded-2xl overflow-hidden h-[50px] w-full max-w-[1200px] mb-0"
    >
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="toggleTab(tab)"
        :class="[
          'flex-1 px-8 py-3 font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300',
          activeTab === tab
            ? 'bg-accent-color text-white'
            : 'bg-[#DAECF6] text-gray-700 hover:bg-gray-200',
        ]"
      >
        <span v-if="tab === 'Client'"><i class="fa-solid fa-user"></i></span>
        <span v-else-if="tab === 'Technician'"><i class="fa-solid fa-screwdriver-wrench"></i></span>
        <span v-else><i class="fa-solid fa-building"></i></span>

        {{ texts[lang].signUp.tabs[tab.toLowerCase()] }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="activeTab" class="w-full flex justify-center">

        <!-- ⭐ CLIENT FORM -->
        <div
          v-if="activeTab === 'Client'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[500px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-3 text-center text-accent-color">
            {{ texts[lang].signUp.client.title }}
          </h2>

          <!-- Profile Picture -->
          <div 
            class="flex flex-col justify-center items-center mb-4 space-y-2 cursor-pointer select-none"
            @click="$refs.clientProfileInput.click()"
          >
            <div
              class="w-20 h-20 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center hover:border-[#5984c6] hover:border-2 relative transition"
            >
              <img
                v-if="profileClientPreview"
                :src="profileClientPreview"
                alt="profile"
                class="w-full h-full object-cover"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 450 512"
                class="w-10 h-10 text-[#5984c6]"
              >
                <path
                  fill="#5984c6"
                  d="M224 248a120 120..."
                />
              </svg>
            </div>

            <p class="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <i class="fa-solid fa-cloud-arrow-up text-[#5984c6]"></i>
              {{ texts[lang].signUp.client.profilePicture }}
            </p>

            <input
              ref="clientProfileInput"
              type="file"
              accept="image/*"
              @change="previewClientProfile"
              class="hidden"
            />
          </div>

          <!-- Inputs -->
          <div class="max-w-6xl mx-auto w-full space-y-6">

            <!-- Name + Email -->
            <div class="grid grid-cols-2 gap-8">
              <input
                v-model="formClient.name"
                type="text"
                :placeholder="texts[lang].signUp.client.fullName"
                required
                class="w-full p-4 border border-gray-300 rounded-xl"
              />

              <input
                v-model="formClient.email"
                type="email"
                :placeholder="texts[lang].signUp.client.email"
                required
                class="w-full p-4 border border-gray-300 rounded-xl"
              />
            </div>

            <!-- Password -->
            <div class="grid grid-cols-2 gap-8">
              <div class="relative">
                <input
                  v-model="formClient.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="texts[lang].signUp.client.password"
                  required
                  minlength="6"
                  class="w-full p-4 border rounded-xl pr-12"
                />
                <button type="button" @click="togglePassword" class="absolute inset-y-0 right-3">
                  <i :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>

              <div class="relative">
                <input
                  v-model="formClient.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :placeholder="texts[lang].signUp.client.confirmPassword"
                  required
                  minlength="6"
                  class="w-full p-4 border rounded-xl pr-12"
                />
                <button type="button" @click="toggleConfirmPassword" class="absolute inset-y-0 right-3">
                  <i :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Phone + Country -->
            <div class="grid grid-cols-2 gap-8">
              <input
                v-model="formClient.phone"
                type="tel"
                :placeholder="texts[lang].signUp.client.phone"
                required
                class="w-full p-4 border rounded-xl"
              />

              <input
                v-model="formClient.address.country"
                type="text"
                :placeholder="texts[lang].signUp.client.country"
                required
                class="w-full p-4 border rounded-xl"
              />
            </div>

            <!-- Address -->
            <div class="grid grid-cols-2 gap-8">
              <input
                v-model="formClient.address.street"
                type="text"
                :placeholder="texts[lang].signUp.client.street"
                required
                class="w-full p-4 border rounded-xl"
              />

              <input
                v-model="formClient.address.city"
                type="text"
                :placeholder="texts[lang].signUp.client.city"
                required
                class="w-full p-4 border rounded-xl"
              />
            </div>
          </div>

          <button
            @click="submitClient"
            class="mt-10 mx-auto bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl"
          >
            {{ texts[lang].signUp.client.submit }}
          </button>

          <p class="text-center mt-4 text-gray-500">
            {{ texts[lang].signUp.client.already }}
            <a :href="loginRoute" class="text-accent-color font-semibold hover:underline">
              {{ texts[lang].signUp.client.loginHere }}
            </a>
          </p>
        </div>

        <!-- ⭐ TECHNICIAN -->
        <div
          v-else-if="activeTab === 'Technician'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[550px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-8 text-center text-accent-color">
            {{ texts[lang].signUp.technician.title }}
          </h2>

          <!-- ID + Profile -->
          <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full">

            <div class="flex flex-col items-start ml-40">
              <label class="font-semibold mb-2">
                {{ texts[lang].signUp.technician.idCard }}
              </label>
              <div @click="$refs.idCardInput.click()" class="w-32 h-32 rounded-full bg-[#f5f5f5] shadow-lg flex items-center justify-center cursor-pointer">
                <i class="fa-regular fa-id-card text-4xl text-accent-color"></i>
              </div>
              <input ref="idCardInput" type="file" @change="previewIdCard" class="hidden" />
            </div>

            <div class="flex flex-col items-end mr-40">
              <label class="font-semibold mb-2">
                {{ texts[lang].signUp.technician.profile }}
              </label>
              <div @click="$refs.profileInput.click()" class="w-32 h-32 rounded-full bg-[#f5f5f5] shadow-lg flex items-center justify-center cursor-pointer">
                <i class="fa-solid fa-user text-4xl text-accent-color"></i>
              </div>
              <input ref="profileInput" type="file" @change="previewProfile" class="hidden" />
            </div>
          </div>

          <!-- Technician Inputs -->
          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formTechnician.name" type="text" :placeholder="texts[lang].signUp.technician.fullName" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.username" type="text" :placeholder="texts[lang].signUp.technician.username" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.email" type="email" :placeholder="texts[lang].signUp.technician.email" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.password" type="password" :placeholder="texts[lang].signUp.technician.password" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.confirmPassword" type="password" :placeholder="texts[lang].signUp.technician.confirmPassword" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.phone" type="text" :placeholder="texts[lang].signUp.technician.phone" class="p-4 border rounded-xl"/>
            </div>

            <div class="flex flex-col gap-5">
              <input v-model="formTechnician.skill" type="text" :placeholder="texts[lang].signUp.technician.skill" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.city" type="text" :placeholder="texts[lang].signUp.technician.city" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.experience" type="text" :placeholder="texts[lang].signUp.technician.experience" class="p-4 border rounded-xl"/>
              <input v-model="formTechnician.address" type="text" :placeholder="texts[lang].signUp.technician.address" class="p-4 border rounded-xl"/>
              <textarea v-model="formTechnician.description" :placeholder="texts[lang].signUp.technician.bio" class="p-4 border rounded-xl resize-none"></textarea>
            </div>
          </div>

          <button
            @click="submitTechnician"
            class="mt-10 mx-auto bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl"
          >
            {{ texts[lang].signUp.technician.submit }}
          </button>

          <p class="text-center mt-4 text-gray-500">
            {{ texts[lang].signUp.technician.already }}
            <a :href="loginRoute" class="text-accent-color font-semibold hover:underline">
              {{ texts[lang].signUp.technician.loginHere }}
            </a>
          </p>
        </div>

        <!-- ⭐ COMPANY -->
        <div
          v-else-if="activeTab === 'Company'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-6 w-[1200px] min-h-[600px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-8 text-center text-accent-color">
            {{ texts[lang].signUp.company.title }}
          </h2>

          <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full">
            <div class="flex flex-col items-start ml-40">
              <label class="font-semibold mb-2">
                {{ texts[lang].signUp.company.taxCard }}
              </label>
              <div @click="$refs.crnInput.click()" class="w-32 h-32 bg-[#f5f5f5] rounded-full shadow-lg flex items-center justify-center cursor-pointer">
                <i class="fa-solid fa-id-card text-4xl text-accent-color"></i>
              </div>
              <input ref="crnInput" type="file" @change="previewCrn" class="hidden"/>
            </div>

            <div class="flex flex-col items-end mr-40">
              <label class="font-semibold mb-2">
                {{ texts[lang].signUp.company.logo }}
              </label>
              <div @click="$refs.logoInput.click()" class="w-32 h-32 bg-[#f5f5f5] rounded-full shadow-lg flex items-center justify-center cursor-pointer">
                <i class="fa-solid fa-building text-4xl text-accent-color"></i>
              </div>
              <input ref="logoInput" type="file" @change="previewLogo" class="hidden"/>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formCompany.companyName" type="text" :placeholder="texts[lang].signUp.company.companyName" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.username" type="text" :placeholder="texts[lang].signUp.company.username" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.email" type="email" :placeholder="texts[lang].signUp.company.email" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.password" type="password" :placeholder="texts[lang].signUp.company.password" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.confirmPassword" type="password" :placeholder="texts[lang].signUp.company.confirmPassword" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.phone" type="text" :placeholder="texts[lang].signUp.company.phone" class="p-4 border rounded-xl"/>
              <textarea v-model="formCompany.description" :placeholder="texts[lang].signUp.company.bio" class="p-4 border rounded-xl resize-none"></textarea>
            </div>

            <div class="flex flex-col gap-5">
              <input v-model="formCompany.address" type="text" :placeholder="texts[lang].signUp.company.address" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.city" type="text" :placeholder="texts[lang].signUp.company.city" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.website" type="text" :placeholder="texts[lang].signUp.company.website" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.teamSize" type="text" :placeholder="texts[lang].signUp.company.teamSize" class="p-4 border rounded-xl"/>
              <input v-model="formCompany.crn" type="text" :placeholder="texts[lang].signUp.company.crn" class="p-4 border rounded-xl"/>
            </div>
          </div>

          <button
            @click="submitCompany"
            class="mt-10 mx-auto bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl"
          >
            {{ texts[lang].signUp.company.submit }}
          </button>

          <p class="text-center mt-4 text-gray-500">
            {{ texts[lang].signUp.company.already }}
            <a :href="loginRoute" class="text-accent-color font-semibold hover:underline">
              {{ texts[lang].signUp.company.loginHere }}
            </a>
          </p>
        </div>

      </div>
    </transition>
  </div>
</template>


<script>
import { useTestLang } from "@/langTest/useTestLang";
const { lang, texts } = useTestLang();
import { auth, db, storage } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default {
  data() {
    return {
      tabs: ["Client", "Technician", "Company"],
      activeTab: "Client",
      loginRoute: "/login",

      // ✅ new state for password visibility
      showPassword: false,
      showConfirmPassword: false,

      // forms
      formClient: {
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: {
          street: "",
          city: "",
          country: "Egypt",
          lat: 30.0444,
          lng: 31.2357,
        },
        profileImage: null,
      },
      formTechnician: {
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        city: "",
        experience: "",
        skill: "",
        certification: "",
        availability: "",
        portfolio: "",
        description: "",
        profileImage: null,
        idCardImage: null,
      },
      formCompany: {
        companyName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        city: "",
        website: "",
        teamSize: "",
        crn: "",
        portfolio: "",
        description: "",
        logoImage: null,
        crnImage: null,
      },

      // messages & previews
      successMessageClient: "",
      successMessageTechnician: "",
      successMessageCompany: "",

      profilePreview: null,
      profileClientPreview: null,
      idCardPreview: null,
      logoPreview: null,
      crnPreview: null,
    };
  },

  watch: {
    "formTechnician.name"(newName) {
      this.updateTechnicianUsername(newName, this.formTechnician.skill);
    },
    "formTechnician.skill"(newSkill) {
      this.updateTechnicianUsername(this.formTechnician.name, newSkill);
    },
  },

  methods: {
    // ✅ new methods to toggle password visibility
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    toggleTab(tab) {
      this.activeTab = tab;
    },

    // preview handlers (store File + create preview)
    previewProfile(e) {
      const file = e.target.files[0];
      if (file) {
        this.formTechnician.profileImage = file;
        this.profilePreview = URL.createObjectURL(file);
      }
    },
    previewClientProfile(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Image should be less than 5MB");
          return;
        }
        this.formClient.profileImage = file;
        this.profileClientPreview = URL.createObjectURL(file);
      }
    },
    previewIdCard(e) {
      const file = e.target.files[0];
      if (file) {
        this.formTechnician.idCardImage = file;
        this.idCardPreview = URL.createObjectURL(file);
      }
    },
    previewLogo(e) {
      const file = e.target.files[0];
      if (file) {
        this.formCompany.logoImage = file;
        this.logoPreview = URL.createObjectURL(file);
      }
    },
    previewCrn(e) {
      const file = e.target.files[0];
      if (file) {
        this.formCompany.crnImage = file;
        this.crnPreview = URL.createObjectURL(file);
      }
    },

    validateEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    },
    validatePhone(phone) {
      return phone === "" || /^\d+$/.test(phone);
    },

    generateUsernameBase(text) {
      if (!text) return "";
      return text.toString().toLowerCase().replace(/[^a-z0-9]/g, "");
    },
    updateTechnicianUsername(name, skill) {
      const nameBase = this.generateUsernameBase(name);
      const skillBase = this.generateUsernameBase(skill);
      if (nameBase && skillBase) {
        this.formTechnician.username = `${nameBase}_${skillBase}`;
      } else if (nameBase) {
        this.formTechnician.username = nameBase;
      } else {
        this.formTechnician.username = "";
      }
    },

    // ---- CLIENT ----
    async submitClient() {
      const f = this.formClient;
      if (
        !f.name ||
        !f.email ||
        !f.password ||
        !f.confirmPassword ||
        !f.phone ||
        !f.address.street ||
        !f.address.city
      ) {
        alert("جميع الحقول مطلوبة");
        return;
      }

      if (!f.username) {
        f.username = f.name.toLowerCase().replace(/\s+/g, "_");
      }

      if (!this.validateEmail(f.email)) {
        alert("البريد الإلكتروني غير صالح");
        return;
      }
      if (f.password !== f.confirmPassword) {
        alert("كلمات المرور غير متطابقة");
        return;
      }
      if (!this.validatePhone(f.phone)) {
        alert("رقم الهاتف يجب أن يحتوي على أرقام فقط");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          f.email,
          f.password
        );
        const user = userCredential.user;

        let profileUrl = "";
        if (f.profileImage) {
          try {
            const pRef = storageRef(storage, `clients/${user.uid}/profile.jpg`);
            await uploadBytes(pRef, f.profileImage);
            profileUrl = await getDownloadURL(pRef);
          } catch (imgErr) {
            console.error("Profile image upload failed:", imgErr);
          }
        }

        const payload = {
          uid: user.uid,
          name: f.name,
          username: f.username,
          email: f.email,
          phone: f.phone,
          address: {
            street: f.address.street,
            city: f.address.city,
            country: f.address.country || "Egypt",
            lat: f.address.lat,
            lng: f.address.lng,
          },
          image: profileUrl || "https://via.placeholder.com/150",
          userType: "client",
          status: "active",
          createdAt: new Date().toISOString(),
          orders: [],
          lastLogin: new Date().toISOString(),
          notifications: [],
          settings: {
            emailNotifications: true,
            language: "ar",
          },
        };

        await setDoc(doc(db, "clients", user.uid), payload);

        Object.keys(f).forEach((k) => (f[k] = ""));
        this.profileClientPreview = null;
        this.successMessageClient = "تم التسجيل بنجاح";
        this.$router.push("/login");
      } catch (err) {
        console.error("Client signup error:", err);
        alert(err.message || "Signup failed.");
      }
    },

    // ---- TECHNICIAN ----
    async submitTechnician() {
      const f = this.formTechnician;
      if (
        !f.name ||
        !f.username ||
        !f.email ||
        !f.password ||
        !f.confirmPassword
      ) {
        alert("Please fill required fields.");
        return;
      }
      if (!this.validateEmail(f.email)) {
        alert("Invalid email.");
        return;
      }
      if (f.password !== f.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (!this.validatePhone(f.phone)) {
        alert("Phone must contain digits only.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          f.email,
          f.password
        );
        const user = userCredential.user;

        let profileUrl = "";
        let idCardUrl = "";

        if (f.profileImage) {
          const pRef = storageRef(storage, `technicians/${user.uid}/profile.jpg`);
          await uploadBytes(pRef, f.profileImage);
          profileUrl = await getDownloadURL(pRef);
        }
        if (f.idCardImage) {
          const idRef = storageRef(storage, `technicians/${user.uid}/idCard.jpg`);
          await uploadBytes(idRef, f.idCardImage);
          idCardUrl = await getDownloadURL(idRef);
        }

        const payload = {
          uid: user.uid,
          name: f.name,
          username: f.username,
          email: f.email,
          phone: f.phone,
          address: f.address,
          city: f.city,
          experience: f.experience,
          skill: f.skill,
          description: f.description || "",
          certification: f.certification || "",
          availability: f.availability || "",
          portfolio: f.portfolio || "",
          profileImage: profileUrl,
          idCardImage: idCardUrl,
          userType: "technician",
          status: "active",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "technicians", user.uid), payload);

        this.$router.push("/technician-dashboard");

        Object.keys(f).forEach((k) => (f[k] = ""));
        this.profilePreview = null;
        this.idCardPreview = null;
        setTimeout(() => (this.successMessageTechnician = ""), 3000);
      } catch (err) {
        console.error("Technician signup error:", err);
        alert(err.message || "Signup failed.");
      }
    },

    // ---- COMPANY ----
    async submitCompany() {
      const f = this.formCompany;
      if (
        !f.companyName ||
        !f.username ||
        !f.email ||
        !f.password ||
        !f.confirmPassword
      ) {
        alert("Please fill required fields.");
        return;
      }
      if (!this.validateEmail(f.email)) {
        alert("Invalid email.");
        return;
      }
      if (f.password !== f.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (!this.validatePhone(f.phone)) {
        alert("Phone must contain digits only.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          f.email,
          f.password
        );
        const user = userCredential.user;

        let logoUrl = "";
        let crnUrl = "";

        if (f.logoImage) {
          const lRef = storageRef(storage, `companies/${user.uid}/logo.jpg`);
          await uploadBytes(lRef, f.logoImage);
          logoUrl = await getDownloadURL(lRef);
        }
        if (f.crnImage) {
          const cRef = storageRef(storage, `companies/${user.uid}/crn.jpg`);
          await uploadBytes(cRef, f.crnImage);
          crnUrl = await getDownloadURL(cRef);
        }

        const payload = {
          uid: user.uid,
          companyName: f.companyName,
          username: f.username,
          email: f.email,
          phone: f.phone,
          address: f.address,
          city: f.city,
          website: f.website || "",
          teamSize: f.teamSize || "",
          crn: f.crn || "",
          description: f.description || "",
          portfolio: f.portfolio || "",
          logo: logoUrl,
          crnImage: crnUrl,
          userType: "company",
          status: "active",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "companies", user.uid), payload);
          this.$router.push("/technician-dashboard");
        Object.keys(f).forEach((k) => (f[k] = ""));
        this.logoPreview = null;
        this.crnPreview = null;
        setTimeout(() => (this.successMessageCompany = ""), 3000);
      } catch (err) {
        console.error("Company signup error:", err);
        alert(err.message || "Signup failed.");
      }
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.5s;
}
.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
}
</style>   