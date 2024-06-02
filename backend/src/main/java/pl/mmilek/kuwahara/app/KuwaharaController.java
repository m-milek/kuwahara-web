package pl.mmilek.kuwahara.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.mmilek.kuwahara.app.algorithm.KuwaharaFilter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
public class KuwaharaController {

    private static final Logger log = LoggerFactory.getLogger(KuwaharaController.class);

    @PostMapping(value = "/kuwahara")
    public static @ResponseBody byte[] transformImage(@RequestParam MultipartFile image, @RequestParam("filter-size") Integer filterSize) throws IOException {
        log.info("Received image with filter size: {}", filterSize);
        System.out.println("Received image with filter size: " + filterSize);
        System.out.println(image.getOriginalFilename());
        System.out.println(image.getSize());
        System.out.println(image.getContentType());

        var bytes = image.getInputStream();
        var inputImage = ImageIO.read(bytes);
        System.out.println(inputImage.getHeight() + "x" + inputImage.getWidth());

        var outputImage = new BufferedImage(inputImage.getWidth(), inputImage.getHeight(), BufferedImage.TYPE_INT_RGB);

        var start = System.currentTimeMillis();

        int cores = Runtime.getRuntime().availableProcessors();
        System.out.println("Cores: " + cores);

        var threads = new Thread[cores];
        for (int i = 0; i < cores; i++) {
            int startRow = i * inputImage.getHeight() / cores;
            int endRow = (i + 1) * inputImage.getHeight() / cores;
            var thread = new Thread(() -> {
                KuwaharaFilter.apply(inputImage, outputImage, startRow, endRow, filterSize);
            });
            threads[i] = thread;
            thread.start();
        }
        for (var thread : threads) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        var end = System.currentTimeMillis();
        System.out.println("Done in: " + (end - start) + "ms");

        String formatName = "png";
        if (image.getOriginalFilename().endsWith(".jpg") || image.getOriginalFilename().endsWith(".jpeg")) {
            formatName = "jpg";
        }

        var baos = new ByteArrayOutputStream();
        ImageIO.write(outputImage, formatName, baos);
        baos.flush();
        var imageInByte = baos.toByteArray();
        System.out.println("Length: " + imageInByte.length);
        baos.close();
        log.info("Finished processing image");
        return imageInByte;
    }
}

