import os
from pydub import AudioSegment

# 音名の変換マップ
note_map = {
    'A': 'A#-Bb', 'A#': 'B', 'B': 'C', 'C': 'C#-Db', 'C#': 'D',
    'D': 'D#-Eb', 'D#': 'E', 'E': 'F', 'F': 'F#-Gb', 'F#': 'G',
    'G': 'G#-Ab', 'G#': 'A'
}

# 入力ファイルのリスト
input_files = [
    "A.wav", "A7.wav", "Aadd9.wav", "Am.wav", "AM7.wav", "Asus4.wav",
    "B.wav", "B7.wav", "Badd9.wav", "Bm.wav", "BM7.wav", "Bsus4.wav",
    "C.wav", "C7.wav", "Cadd9.wav", "Cm.wav", "CM7.wav", "Csus4.wav",
    "D-1.wav", "D7.wav", "Dadd9.wav", "Dm.wav", "DM7.wav", "Dsus4.wav",
    "E.wav", "E7.wav", "Eadd9.wav", "Em.wav", "EM7.wav", "Esus4.wav",
    "F.wav", "F7.wav", "Fadd9.wav", "Fm.wav", "FM7.wav", "Fsus4.wav",
    "G.wav", "G7.wav", "Gadd9.wav", "Gm.wav", "GM7.wav", "Gsus4-1.wav"
]

# 出力ディレクトリ
output_dir = "shifted_output"

# 出力ディレクトリが存在しない場合は作成
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 半音上げ（約1.0595倍）
semitone_ratio = 2 ** (1/12)

def shift_note_name(filename):
    for note in note_map:
        if filename.startswith(note):
            return filename.replace(note, note_map[note], 1)
    return filename

def sanitize_filename(filename):
    # ファイル名から無効な文字を除去または置換
    return filename.replace('/', '-').replace('\\', '-')

for input_file in input_files:
    # 入力ファイルを読み込む
    audio = AudioSegment.from_wav(input_file)
    
    # ピッチシフト（サンプルレートを変更することでピッチを変更）
    shifted_audio = audio._spawn(audio.raw_data, overrides={
        "frame_rate": int(audio.frame_rate * semitone_ratio)
    })
    
    # 元の長さを維持
    shifted_audio = shifted_audio.set_frame_rate(audio.frame_rate)
    
    # 新しいファイル名を生成し、サニタイズ
    new_filename = shift_note_name(os.path.splitext(input_file)[0])
    new_filename = sanitize_filename(new_filename)
    output_file = f"{new_filename}.wav"
    
    # 変更したオーディオを保存
    shifted_audio.export(os.path.join(output_dir, output_file), format="wav")
    
    print(f"Processed: {input_file} -> {output_file}")

print("All files have been processed and saved in the 'shifted_output' directory.")
