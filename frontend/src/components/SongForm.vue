  <script setup>
  import { ref } from 'vue';

  const props = defineProps({
    song: { type: Object, required: true },
    genres: { type: Array, required: true }, 
    artists: { type: Array, required: true } 
  });

  let selectedArtistId = ref('');
  let avatarFileInput = ref(null);
  let avatarFile = ref(props.song.avatar);
  let audioFileInput = ref(null);  
  let audioFile = ref(props.song.sound);
  let formValues = ref({
    song_name: props.song?.song_name || '',
    genre_id: props.song?.genre_id || '',   
    streaming_count: props.song?.streaming_count || '',
    duration: props.song?.duration || '', 
    release_date: props.song?.release_date || '',
    artist_ids: props.song?.artist_id || [],  
  });
  let formErrors = ref({});

  const $emit = defineEmits(['submit:song', 'delete:song']);

  // Hàm kiểm tra tính hợp lệ của form
  function validateForm() {
    formErrors.value = {};
    const { song_name, genre_id, streaming_count, duration, release_date, artist_ids } = formValues.value;

    if (song_name.length < 2 || song_name.length > 100) {
      formErrors.value.song_name = 'Tên bài hát phải từ 2 đến 100 ký tự.';
    }
    if (!genre_id) {
      formErrors.value.genre_id = 'Vui lòng chọn thể loại.';
    }
    if (!Number.isInteger(parseInt(streaming_count))) {
      formErrors.value.streaming_count = 'Lượt nghe phải là số nguyên.';
    }
    if (artist_ids.length === 0) {
      formErrors.value.artist_ids = 'Vui lòng chọn ít nhất một nghệ sĩ.';
    }
    if (!duration || isNaN(duration) || duration <= 0) {
      formErrors.value.duration = 'Thời lượng phải là một số dương.';
    }
    if (!release_date) {
      formErrors.value.release_date = 'Ngày phát hành là bắt buộc.';
    }

    return Object.keys(formErrors.value).length === 0;
  }


  function previewAvatarFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      avatarFile.value = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  // hàm preview âm thanh
function previewAudioFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
     console.log(reader)
    reader.onload = (evt) => {
      audioFile.value = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
  
}

  function submitSong() {
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(formValues.value).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    // Append selected artist IDs to form data
    formValues.value.artist_ids.forEach(artistId => {
      formData.append('artist_id[]', artistId);
    });
    if (props.song.song_id) {
      formData.append('song_id', props.song.song_id);
    }
    console.log(formValues.value.artist_ids, formData.get('artist_id'));
    formData.append('avatarFile', avatarFileInput.value.files[0]);
    formData.append('soundFile', audioFileInput.value.files[0]);
    console.log(formData.get('avatarFile'));
    $emit('submit:song', formData);
  }


  function deleteSong() {
    $emit('delete:song', props.song.song_id);
  }

  function getArtistNameById(artistId) {
    const artist = props.artists.find(a => a.artist_id === artistId);
    return artist ? artist.artist_name : '';
  }
function addArtist(artistId) {
  if (artistId && !formValues.value.artist_ids.includes(artistId)) {
    formValues.value.artist_ids.push(artistId);
    selectedArtistId.value = ''; 
  }
}

  // hàm xóa nghệ sĩ khỏi danh sách đã chọn
  function removeArtist(index) {
    formValues.value.artist_ids.splice(index, 1);
  }

  </script>

<template>
  <form @submit.prevent="submitSong">
    <!-- Tên bài hát -->
    <div class="form-group">
      <label for="song_name" class="text-light">Tên bài hát</label>
      <input 
        v-model="formValues.song_name" 
        type="text" 
        class="form-control" 
        :class="{'is-invalid': formErrors.song_name}" 
        placeholder="Nhập tên bài hát" 
      />
      <div v-if="formErrors.song_name" class="invalid-feedback">{{ formErrors.song_name }}</div>
    </div>

    <!-- Genre -->
    <div class="form-group">
      <label for="genre" class="text-light">Chọn thể loại</label>
      <select v-model="formValues.genre_id" id="genre" class="form-control">
        <option v-for="genre in genres" :key="genre.genre_id" :value="genre.genre_id">
          {{ genre.genre_name }}
        </option>
      </select>
      <div v-if="formErrors.genre_id" class="invalid-feedback">{{ formErrors.genre_id }}</div>
    </div>

    <!-- Artists -->
    <div class="form-group">
      <label for="artists" class="text-light">Chọn nghệ sĩ</label>
      <select v-model="selectedArtistId" id="artists" class="form-control">
        <option value="" disabled>Chọn nghệ sĩ</option>
        <option v-for="artist in artists" :key="artist.artist_id" :value="artist.artist_id">
          {{ artist.artist_name }}
        </option>
      </select>
      <button type="button" @click="addArtist(selectedArtistId)" class="btn btn-outline-secondary mt-2">Thêm nghệ sĩ</button>
      <div v-if="formErrors.artist_ids" class="invalid-feedback">{{ formErrors.artist_ids }}</div>

      <!-- Display selected artists as chips -->
      <div v-if="formValues.artist_ids.length > 0" class="selected-artists">
        <div v-for="(artistId, index) in formValues.artist_ids" :key="artistId" class="chip">
          <span>{{ getArtistNameById(artistId) }}</span>
          <button @click="removeArtist(index)" class="remove-chip-btn">X</button>
        </div>
      </div>
    </div>

    <!-- Streaming -->
    <div class="form-group">
      <label for="streaming_count" class="text-light">Lượt nghe</label>
      <input 
        v-model="formValues.streaming_count" 
        type="text" 
        class="form-control" 
        :class="{'is-invalid': formErrors.streaming_count}" 
        placeholder="Nhập lượt nghe" 
      />
      <div v-if="formErrors.streaming_count" class="invalid-feedback">{{ formErrors.streaming_count }}</div>
    </div>

    <!-- Duration -->
    <div class="form-group">
      <label for="duration" class="text-light">Thời lượng (giây)</label>
      <input 
        v-model="formValues.duration" 
        type="number" 
        class="form-control" 
        :class="{'is-invalid': formErrors.duration}" 
        placeholder="Nhập thời lượng bài hát" 
      />
      <div v-if="formErrors.duration" class="invalid-feedback">{{ formErrors.duration }}</div>
    </div>

    <!-- Release Date -->
    <div class="form-group">
      <label for="release_date" class="text-light">Ngày phát hành</label>
      <input 
        v-model="formValues.release_date" 
        type="date" 
        class="form-control" 
        :class="{'is-invalid': formErrors.release_date}" 
        placeholder="Chọn ngày phát hành" 
      />
      <div v-if="formErrors.release_date" class="invalid-feedback">{{ formErrors.release_date }}</div>
    </div>

    <!-- Avatar Upload -->
    <div class="form-group">
      <label for="avatarFile" class="text-light">Ảnh đại diện</label>
      <div class="avatar-upload">
        <img :src="avatarFile" alt="Avatar" @click="avatarFileInput.click()" class="avatar-preview" />
        <input type="file" ref="avatarFileInput" class="d-none" @change="previewAvatarFile" />
      </div>
    </div>

    <!-- Audio Upload -->
    <div class="form-group">
      <label for="audioFile" class="text-light">Âm thanh</label>
      <div class="audio-upload">
        <audio :src="audioFile" controls class="audio-preview" style="width: 100%;"></audio>
        <input type="file" ref="audioFileInput" class="d-none" @change="previewAudioFile" />
        <button type="button" @click="audioFileInput.click()" class="btn btn-outline-secondary mt-2">Chọn âm thanh</button>
      </div>
    </div>

    <button type="submit" class="btn btn-success w-100">Lưu</button>
    <div class="text-center mt-4">
          <button class="btn btn-danger" @click="deleteSong()">Xoá bài hát</button>
    </div>
  </form>
</template>

<style scoped>
/* Giữ lại kiểu dáng Avatar và Audio như trước */
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-top: 1rem;
}
.form-control{
  background-color: #121212;
  color: #6c757d;
}
.form-control::placeholder{
  color: #6c757d;
}
.form-group{
  margin-top: 10px;
}
.avatar-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.avatar-preview:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.audio-preview {
  margin-top: 1rem;
}

.selected-artists {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  background-color: #218838;
  color: white;
  padding: 5px 10px;
  border-radius: 5%;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.remove-chip-btn {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
